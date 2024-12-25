export class Constant {
  
    public static EVENT_TYPE = {
        StartMoving: "start_moving",
        MoveEnd: "move_end",
        CarmeraRotate: "camera_rotate",
        CarmeraRole: "camera_role",
        AngleOffset: "angle_offset",
        TouchEnded : "touchEnded",
        TouchStarted : "touchStarted",
        DeductAnObject : "deductAnObject",
        ScoreCounter   : "IncrementScore",
        LevelUpgraded : "LevelUpgraded",
        Notools : "NoEnoughTools",
        TRIGGER_ENDCARD: "TriggerEndcard"
    }

     public static ismoving = false;
     public static isColliding = false;

}

