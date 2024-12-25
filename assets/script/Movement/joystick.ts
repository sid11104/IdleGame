
import { _decorator, Component, Node, EventTouch, Vec3, UITransform } from 'cc';
import { clientEvent } from '../Utilities/clientEvent';
import { Constant } from '../Utilities/constant';

const { ccclass, property } = _decorator;
@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node)
    joystickBg: Node = undefined as unknown as Node;

    @property(Node)
    joystickBar: Node = undefined as unknown as Node;

    private _originPos: Vec3 = new Vec3();
    private _R: number = 100;
    private _angle: number = 0;
    private _radiu: number = 0;
    private _isMoving: boolean = false;
    private _isUseful: boolean = false;
    private _angleOffSet: number = 0;

    onLoad() {
        clientEvent.on(Constant.EVENT_TYPE.AngleOffset, this._setAngleOffset, this);
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        this._originPos.set(this.joystickBg.getPosition().x, this.joystickBg.getPosition().y, 0);
    }
    onDestroy() {
        clientEvent.off(Constant.EVENT_TYPE.AngleOffset, this._setAngleOffset, this);
    }
    private _touchStart(event: EventTouch) {
        // Constant.ismoving = true;
        let touchPos = event.getUILocation();
        let pos = new Vec3(touchPos.x, touchPos.y, 0);
        pos = this.node.parent?.getComponent(UITransform)?.convertToNodeSpaceAR(pos) as Vec3;
        if (pos.x > 0 || pos.y > 0) {
            this._isUseful = false;
            return;
        }
        this._isUseful = true;
        this.joystickBg.setPosition(pos);
    }

    private _touchMove(event: EventTouch) {
        // Constant.ismoving = true;
        if (!this._isUseful) {
            clientEvent.dispatchEvent(Constant.EVENT_TYPE.CarmeraRotate, event);
            return;
        }
        this._isMoving = true;
        let touchPos = event.getUILocation();
        let pos = new Vec3(touchPos.x, touchPos.y, 0);
        pos = this.joystickBg?.getComponent(UITransform)?.convertToNodeSpaceAR(pos) as Vec3;
        let radius = Math.atan2(pos.y, pos.x);
        let out = new Vec3();
        let len = Vec3.subtract(out, pos, new Vec3()).length();
        if (len >= this._R) {
            let xx = Math.cos(radius) * this._R;
            let yy = Math.sin(radius) * this._R;
            this.joystickBar.setPosition(new Vec3(xx, yy, 0));
        }
        else {
            this.joystickBar.setPosition(pos);
        }
        this._angle = radius * 180 / Math.PI - this._angleOffSet;
        this._radiu = radius - this._angleOffSet / 180 * Math.PI;

    }

    private _touchEnd(event: EventTouch) {
        clientEvent.dispatchEvent(Constant.EVENT_TYPE.MoveEnd);
        if (!this._isUseful) return;
        this._isUseful = false;
        this.joystickBg.setPosition(this._originPos);
        this.joystickBar.setPosition(new Vec3());
        this._isMoving = false;
    }


    private _setAngleOffset(angleOffset: number) {
        this._angleOffSet = angleOffset;
    }


    update(delta: number) {
        if (this._isMoving) {
            clientEvent.dispatchEvent(Constant.EVENT_TYPE.StartMoving, this._angle, this._radiu);
        }
    }

}


