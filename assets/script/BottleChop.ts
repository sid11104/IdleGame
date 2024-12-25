import { _decorator, Component, Node, SkeletalAnimationComponent, ParticleSystem, Animation, RigidBody, Vec3, BoxCollider, ICollisionEvent } from 'cc';
import { Constant } from './Utilities/constant';
import { clientEvent } from './Utilities/clientEvent';
import { WeaponManagement } from './WeaponManagement';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;


@ccclass('BottleChop')
export class BottleChop extends Component {

    @property(Node)
    player: Node = null; // Animation component for the player


    noOfChops = 0;

    maxChops = 1;


    ifcollisionOver: boolean;

    @property(SkeletalAnimationComponent)
    playerRootAnim: SkeletalAnimationComponent;


    @property(Node)
    glassParticle: Node;


    @property(Node)
    poofParticle: Node;

    @property(Node)
    podium: Node;

    bottleShakeAnimation: Animation;


    @property(WeaponManagement)
    weaponMgt: WeaponManagement;



    start() {

        this.ifcollisionOver = false;
        this.noOfChops = 0;

        clientEvent.on(Constant.EVENT_TYPE.TouchEnded, this.enablePhysicsComponents, this);
        clientEvent.on(Constant.EVENT_TYPE.TouchStarted, this.disablePhysicsComponents, this);

        if (this.player) {
            const collider = this.player.getComponent(BoxCollider);
            if (collider) {
                collider.on('onCollisionEnter', this._onCollisionEnter, this);
                collider.on('onCollisionStay', this.onCollisionStay, this);
                collider.on('onCollisionExit', this._onCollisionExit, this);

            } else {
                //console.error('Collider component not found on the player node!');
            }
        }

    }

    enablePhysicsComponents() {
        if (this.podium) {
            this.podium.active = true;
            this.setColliders();
        }
    }

    disablePhysicsComponents() {
        if (this.podium) {
            this.podium.active = false;

        }
    }

    setColliders() {
        if (this.player) {
            const collider = this.player.getComponent(BoxCollider);
            if (collider) {
                collider.on('onTriggerEnter', this._onTriggerEnter, this);
                collider.on('onTriggerStay', this._onTriggerStay, this);
                collider.on('onTriggerExit', this._onTriggerExit, this);

            } else {
                //console.error('Collider component not found on the player node!');
            }
        }
    }


    _onTriggerEnter(event: ICollisionEvent) {

        if (Constant.ismoving == false) {

            const otherCollider = event.otherCollider;
            const otherNode = otherCollider.node;

            if (otherNode === this.podium) {
                if (this.weaponMgt.getCurrentWeaponState() == 3) {

                    this.ifcollisionOver = false;
                    this.startChopping();
                } else {
                    clientEvent.dispatchEvent(Constant.EVENT_TYPE.Notools);

                }
            }
        }
    }

    _onTriggerStay() {

    }

    _onTriggerExit(event: ICollisionEvent) {
        if (!this.node) {

            const otherCollider = event.otherCollider;
            const otherNode = otherCollider.node;
            if (otherNode === this.podium) {
                if (this.weaponMgt.getCurrentWeaponState() == 3) {
                    this.ifcollisionOver = true;
                }
            }
        }
    }




    _onCollisionEnter(event: ICollisionEvent) {

    }


    onCollisionStay() {

    }

    startChopping() {
        const animationName = 'Armature.001|Armature.001|AXE';

        const animState = this.playerRootAnim.getState(animationName);
        if (animState) {
            AudioManager.playSound("bottleAudio");

            this.playerRootAnim.play(animationName);

            this.scheduleOnce(() => {
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.ScoreCounter);
                this.glassParticle.getComponent(ParticleSystem).play();
                this.poofParticle.getComponent(ParticleSystem).play();
                this.node.getComponent(Animation).play("glassShake");
            }, 0.5);

        } else {
            console.warn(`Animation "${animationName}" not found.`);
        }
        this.playerRootAnim.on(SkeletalAnimationComponent.EventType.FINISHED, this.onAnimationComplete, this);
    }


    onAnimationComplete() {

        if (!this.ifcollisionOver && this.noOfChops < this.maxChops) {
            this.noOfChops++;

            this.startChopping();
        } else if (this.noOfChops == this.maxChops) {
            this.node.destroy();
            this.playerRootAnim.play('Armature.001|Armature.001|IDLE');
            clientEvent.dispatchEvent(Constant.EVENT_TYPE.DeductAnObject);

        }
    }

    _onCollisionExit() {

    }

    update(deltaTime: number) {

    }


}

