
import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, BoxCollider, Enum, ICollisionEvent, AnimationState, Prefab, instantiate, find, tween, Collider, RigidBody } from 'cc';
import { clientEvent } from '../Utilities/clientEvent';
import { Constant } from '../Utilities/constant';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _speed: number = 1.5;
    private _isMoving: boolean = false;
    private _originPos: Vec3 = new Vec3();
    private _collisionNormal: Vec3 = new Vec3(0, 0, 0);

    private _collisionOffset: Vec3 = new Vec3();


    @property(SkeletalAnimationComponent)
    playerRooyNode: SkeletalAnimationComponent;


    onLoad() {

        clientEvent.on(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
        clientEvent.on(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.dispatchEvent(Constant.EVENT_TYPE.CarmeraRole, this.node);
        this._originPos = this.node.getPosition();

        if (this.node) {
            const collider = this.node.getComponent(BoxCollider);
            if (collider) {
                collider.on('onCollisionEnter', this._onCollisionEnter, this);
                collider.on('onCollisionStay', this._onCollisionStay, this);
                collider.on('onCollisionExit', this._onCollisionExit, this);

            } else {
                //console.error('Collider component not found on the player node!');
            }
        }
    }

    _onCollisionEnter(event: ICollisionEvent) {
        this.node.getComponent(RigidBody).setLinearVelocity(Vec3.ZERO);
        this.node.getComponent(RigidBody).setAngularVelocity(Vec3.ZERO);
    }

    _onCollisionStay(event: ICollisionEvent) {

        this.node.getComponent(RigidBody).setLinearVelocity(Vec3.ZERO);
        this.node.getComponent(RigidBody).setAngularVelocity(Vec3.ZERO);

    }

    _onCollisionExit(event: ICollisionEvent) {
        this.node.getComponent(RigidBody).setLinearVelocity(Vec3.ZERO);
        this.node.getComponent(RigidBody).setAngularVelocity(Vec3.ZERO);
    }


    onDestroy() {
        clientEvent.off(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
        clientEvent.off(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
    }




    private _startMoving(angle: number, radius: number) {
        if (!Constant.isColliding) {
            if (!this._isMoving) {
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.TouchStarted);
                this.playerRooyNode.play("Armature.001|Armature.001|RUN");
                this._isMoving = true;
            }
            let eularangle = this.node.eulerAngles;
            eularangle.set(eularangle.x, angle, eularangle.z);
            this.node.eulerAngles = eularangle;

            let zz = Math.cos(radius) * this._speed;
            let xx = Math.sin(radius) * this._speed;
            this._originPos.add(new Vec3(xx, 0, zz));
            this.node.setPosition(this._originPos);
        }
    }


    public getMoveState() {
        return this._isMoving;
    }

    private _moveEnd() {
        this.playerRooyNode.play("Armature.001|Armature.001|IDLE");
        Constant.ismoving = false;
        this._isMoving = false;
        clientEvent.dispatchEvent(Constant.EVENT_TYPE.TouchEnded);
    }


}


