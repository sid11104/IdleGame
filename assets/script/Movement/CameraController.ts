
import { _decorator, Component, Node, Vec3, EventTouch, CameraComponent } from 'cc';
import { clientEvent } from '../Utilities/clientEvent';
import { Constant } from '../Utilities/constant';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    public static mainCamera: CameraComponent | null = null;
    private _followRole: Node = null as unknown as Node;
    private _oriCameraWorPos: Vec3 = new Vec3();
    private _oriCameraEuler: Vec3 = new Vec3();

    private _tempPos: Vec3 = new Vec3();
    private _isRotating: boolean = false;
    private _speed: number = 1.5;
    private _angleOffSet: number = 0;


    onLoad() {
        clientEvent.on(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.on(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
        this._oriCameraWorPos = this.node.getPosition().clone();
        this._oriCameraEuler = this.node.eulerAngles.clone();
        CameraController.mainCamera = this.node.getComponent(CameraComponent);
        this._test();

    }
    onDestroy() {
        clientEvent.off(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.off(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
    }

    private _test() {
    }


    private _startMoving(angle: number, radius: number) {
        let zz = Math.cos(radius) * this._speed;
        let xx = Math.sin(radius) * this._speed;
        this._oriCameraWorPos.add(new Vec3(xx, 0, zz));
        this.node.setPosition(this._oriCameraWorPos);
    }

    private _moveEnd() {
        this._isRotating = false;
        clientEvent.dispatchEvent(Constant.EVENT_TYPE.AngleOffset, this._angleOffSet);
    }


}


