import { _decorator, Component, Node, Label, AudioSource } from 'cc';
import { WeaponManagement } from './WeaponManagement';
import { Constant } from './Utilities/constant';
import { clientEvent } from './Utilities/clientEvent';
import { AudioManager } from './AudioManager';
import super_html_playable from './super_html/super_html_playable';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {


    @property(Label)
    public label1: Label | null = null;

    @property(Label)
    public label2: Label | null = null;

    @property(Label)
    public label3: Label | null = null;

    private currentValue: number = 0;
    private targetValue: number = 20;
    private incrementSpeed: number = 1;

    private _currentLabel: Label;


    @property(Node)
    tools: Node;

    @property(Node)
    CTA: Node;

    @property(Node)
    weaponUpgrade: Node

    @property(WeaponManagement)
    weaponMgt: WeaponManagement;

    @property(Node)
    ftue: Node;

    @property(Node)
    endCard: Node;

    @property(AudioSource)
    sfxAud: AudioSource;



    start() {

        AudioManager.init(this.sfxAud);
        clientEvent.on(Constant.EVENT_TYPE.ScoreCounter, this.setLabel, this);
        clientEvent.on(Constant.EVENT_TYPE.LevelUpgraded, this.resetValue, this);
        clientEvent.on(Constant.EVENT_TYPE.Notools, this.enableNoEnoughTools, this);
        clientEvent.on(Constant.EVENT_TYPE.TRIGGER_ENDCARD, this.enableEndCard, this);


        super_html_playable.set_google_play_url("https://google.com");
        super_html_playable.set_app_store_url("https://google.com");

    }

    on_click_game_end() {
        super_html_playable.game_end();
    }

    on_click_download() {


        //cta for unity
        //@ts-ignore
       // window.userClickedDownloadButton();

        this.on_click_game_end();
        super_html_playable.download();
    }


    startGame() {
        this.ftue.destroy();
    }


    enableNoEnoughTools() {
        this.tools.active = true;
        this.scheduleOnce(() => {
            this.tools.active = false;
        }, 1);

    }

    update(deltaTime: number) {

    }

    enableEndCard() {
        this.endCard.active = true;
    }

    resetValue() {
        this.scheduleOnce(() => {
            this.targetValue = 20;
            this.currentValue = 0;
        }, 0.5);
    }

    setLabel() {
        switch (this.weaponMgt.getCurrentWeaponState()) {
            case 1:
                this._currentLabel = this.label1;
                this.startIncrement();
                break;
            case 2:
                this._currentLabel = this.label2;
                this.startIncrement();
                break;
            case 3:
                this._currentLabel = this.label3;
                this.startIncrement();
                break;
            default:
                break;

        }

        if (!this._currentLabel) {
            console.error("Label component is not assigned!");
            return;
        }

    }

    startIncrement() {
        this.schedule(this.incrementCounter, 0.0001);
    }

    private incrementCounter() {
        if (this.currentValue < this.targetValue) {
            this.currentValue++;
            this._currentLabel!.string = this.currentValue.toString();
        } else {
            this.currentValue = this.targetValue;
            this.targetValue = this.targetValue + 20;
            this.unschedule(this.incrementCounter);
        }
    }


    upgradeLevel() {

    }


    triggerCTA() {
       this.on_click_download();
    }


}

