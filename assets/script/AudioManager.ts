import { _decorator, Component, Node, AudioClip, AudioSource, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property(AudioSource)
    public AudioSource_One: AudioSource[] = []

    private static _audioSource?: AudioSource;

    private static _audioSrcObj: AudioManager;

    private static _cachedAudioClipMap: Record<string, AudioClip> = {};

    private constructor() {
        super();
        if (AudioManager._audioSrcObj)
            console.log("Instance already created");
        else
            AudioManager._audioSrcObj = this;

    }

    public static init(audioSource: AudioSource) {
        AudioManager._audioSource = audioSource;
    }


    static get instance() {
        return AudioManager._audioSrcObj ?? (AudioManager._audioSrcObj = new AudioManager());
    }

    public static playSound(name: string) {

        const audioSource = AudioManager._audioSource;

        var path = `audio/${name}`;
        let cachedAudioClip = AudioManager._cachedAudioClipMap[path];


        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, 0.7);
        } else {
            // assetManager.resources.load()

            assetManager.resources.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(err);
                    return;
                } else {
                    AudioManager._cachedAudioClipMap[path] = clip;
                    audioSource.playOneShot(clip, 0.7);
                }

            });
        }
    }


}

