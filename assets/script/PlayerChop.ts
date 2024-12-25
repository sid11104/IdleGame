import { _decorator, Component, Node, Vec3, Collider, ITriggerEvent, Color, MeshRenderer, AnimationClip, AnimationState, Animation, SkeletalAnimationComponent, Quat, RigidBody, math, BoxCollider, ICollisionEvent, ParticleAsset, ParticleSystem } from 'cc';
import { Constant } from './Utilities/constant';
import { clientEvent } from './Utilities/clientEvent';
import { WeaponManagement } from './WeaponManagement';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('PlayerChop')
export class PlayerChop extends Component {

    @property(Node)
    player: Node = null;
    noOfChops = 0;

    maxChops = 3;

    ifcollisionOver: boolean;

    @property(SkeletalAnimationComponent)
    playerRootAnim: SkeletalAnimationComponent;

    @property(Node)
    treeRenderer: Node;

    treeMeshRenderer;

    originalMaterial;

    originalColor;

    @property(Node)
    poofOne: Node;

    @property(Node)
    poofTwo: Node;

    @property(Node)
    bloom: Node;

    @property(Node)
    poofThree: Node;

    @property(Node)
    podium: Node;

    @property(WeaponManagement)
    weaponMgt: WeaponManagement;

    protected start(): void {
        this.ifcollisionOver = false;
        this.noOfChops = 0;

        this.treeMeshRenderer = this.treeRenderer.getComponent(MeshRenderer);
        clientEvent.on(Constant.EVENT_TYPE.TouchEnded, this.enablePhysicsComponents, this);
        clientEvent.on(Constant.EVENT_TYPE.TouchStarted, this.disablePhysicsComponents, this);


        if (this.treeMeshRenderer) {
            this.originalMaterial = this.treeMeshRenderer.material;
            this.originalMaterial.getProperty('emissive') || new Color(0, 0, 0);
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
                if (this.weaponMgt.getCurrentWeaponState() == 1) {
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
                this.ifcollisionOver = true;
            }
        }
    }

    private _stopPlayerMovement() {
        const playerRigidBody = this.player.getComponent(RigidBody);
        if (playerRigidBody) {
            playerRigidBody.setLinearVelocity(Vec3.ZERO); // Stop any movement
            playerRigidBody.setAngularVelocity(Vec3.ZERO); // Stop rotation
        }
    }


    startChopping() {
        console.log("Started")

        if (this.noOfChops == this.maxChops) {
            this.node.destroy();
            this.playerRootAnim.play('Armature.001|Armature.001|IDLE');
            clientEvent.dispatchEvent(Constant.EVENT_TYPE.DeductAnObject);
        } else {

            this.noOfChops++;
            AudioManager.playSound("woodAudio");
            const animationName = 'Armature.001|Armature.001|AXE';

            const animState = this.playerRootAnim.getState(animationName);
            if (animState) {
                this.playerRootAnim.play(animationName);

                this.scheduleOnce(() => {

                    this.poofOne.getComponent(ParticleSystem).play();
                    this.poofTwo.getComponent(ParticleSystem).play();
                    this.poofThree.getComponent(ParticleSystem).play();
                    this.bloom.getComponent(ParticleSystem).play();
                    clientEvent.dispatchEvent(Constant.EVENT_TYPE.ScoreCounter);
                    this.node.getComponent(Animation).play("treewobble");
                }, 0.5);

            } else {
                console.warn(`Animation "${animationName}" not found.`);
            }
            this.playerRootAnim.on(SkeletalAnimationComponent.EventType.FINISHED, this.onAnimationComplete, this);
        }

    }

    resetTreeColor() {
        this.treeMeshRenderer.material.setProperty('emissive', new Color(0, 0, 0));
    }


    onAnimationComplete() {

        if (!this.ifcollisionOver && this.noOfChops < this.maxChops) {
            this.startChopping();
        } else if (this.noOfChops == this.maxChops) {
            this.node.destroy();
            this.playerRootAnim.play('Armature.001|Armature.001|IDLE');
            clientEvent.dispatchEvent(Constant.EVENT_TYPE.DeductAnObject);
        }

    }

}