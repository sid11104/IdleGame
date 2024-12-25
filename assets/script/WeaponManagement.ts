import { _decorator, BoxCollider, Component, CylinderCollider, Node,ICollisionEvent,tween,Vec3 } from 'cc';
import { clientEvent } from './Utilities/clientEvent';
import { Constant } from './Utilities/constant';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('WeaponManagement')
export class WeaponManagement extends Component {

    @property(Node)
    weaponOneuI : Node;

    @property(Node)
    weaponOne : Node;

    @property(Node)
    player : Node;

    @property(Node)
    uiPodium : Node;

    @property(typeof(Number))
    totalTrees : number;

    @property(typeof(Number))
    totalBarrels : number;

    @property(typeof(Number))
    totalBottles : number;

    @property(Node)
    levelUpgradePanel : Node;

    @property(Node)
    LevelOneIns : Node;

    @property(Node)
    LevelTwoIns : Node;

    @property(Node)
    LevelThreeIns : Node;

    @property(Node)
    LevelFourIns : Node;

    currentWeaponState : Number;

    private _podiumCollider : CylinderCollider;

    onLoad() {
        clientEvent.on(Constant.EVENT_TYPE.DeductAnObject, this.deductAnObject, this);
        
        const collider = this.player.getComponent(BoxCollider);
        if (collider) {
            collider.on('onTriggerEnter', this._onTriggerEnter, this);
        } else {
            console.error('Collider component not found on the player node!');
        }

        this.LevelOneIns.active = true;
    }

    deductAnObject() {
        switch(this.currentWeaponState) {
            case 1:
                this.totalTrees--;
                this.checkForLevelUpgrade();
                break;
            case 2:
                this.totalBarrels--;
                this.checkForLevelUpgrade();
                break;
            case 3:
                this.totalBottles--;
                this.checkForLevelUpgrade();
                break;
            case 4:
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.TRIGGER_ENDCARD);
            default:
                break;
        }
    }



    checkForLevelUpgrade() {
        if(this.currentWeaponState == 1) {
            if(this.totalTrees == 0) {
                console.log("Upgrade level");
                this.currentWeaponState = 2;
                this.LevelOneIns.active = false;
                this.LevelTwoIns.active = true;
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.LevelUpgraded);
                this.enableUpgradationPanel();
            }
        } else if(this.currentWeaponState == 2) {
            if(this.totalBarrels == 0) {
                console.log("Upgrade level");
                this.currentWeaponState = 3;
                this.LevelTwoIns.active = false;
                this.LevelThreeIns.active = true;
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.LevelUpgraded);
                this.enableUpgradationPanel();
            }
        } else if(this.currentWeaponState == 3) {
            if(this.totalBottles == 0) {
                console.log("Upgrade level");
                this.currentWeaponState = 4;
                this.LevelThreeIns.active = false;
                this.LevelFourIns.active = true;
                clientEvent.dispatchEvent(Constant.EVENT_TYPE.LevelUpgraded);
                this.enableUpgradationPanel();
            }
        }
    }


    enableUpgradationPanel() {

        this.levelUpgradePanel.setScale(0,0,0)
         this.levelUpgradePanel.active = true;
         tween(this.levelUpgradePanel).to(1, {scale: new Vec3(1,1,1)},{ easing: 'bounceInOut' }).start();
         this.scheduleOnce(() => {
            this.levelUpgradePanel.active = false;
        }, 3);

    }


    start() {
        this._podiumCollider = this.uiPodium.getComponent(CylinderCollider);
        this.currentWeaponState = 0;
    }

    _onTriggerEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        const otherNode = otherCollider.node;

        if (otherNode === this.uiPodium) {
            this.acquireWeponOne();
        }
    }

    getCurrentWeaponState() {
        return this.currentWeaponState;
    }


    acquireWeponOne(){ 
        this.weaponOne.active = true;
        this.weaponOneuI.destroy();
        this.setWeaponState(1);

    }

    acquireWeaponTwo() {
        this.setWeaponState(2);
        
    }

    acquireWeaponThree() {
        this.setWeaponState(3);
    }

    setWeaponState(state : number) {
        this.currentWeaponState = state;

    }


}

