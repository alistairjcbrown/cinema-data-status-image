import RPi.GPIO as GPIO
from os.path import exists

class PiTFT_Screen(object):

    def __init__(self):
        self.__pin1 = 17
        self.__pin2 = 22
        self.__pin3 = 23
        self.__pin4 = 27
        self.__pin_pwm = 18

        GPIO.setmode(GPIO.BCM)

        # Initialise buttons
        GPIO.setup(self.__pin1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.__pin2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.__pin3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.__pin4, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        # Initialise backlight
        GPIO.setup(self.__pin_pwm, GPIO.OUT)
        self.pwm = GPIO.PWM(self.__pin_pwm, 100)  # 100 Hz frequency
        self.pwm.start(100)

    def Backlight(self, light):
        """Set the backlight on or off."""
        self.pwm.ChangeDutyCycle(100 if light else 0)

    def Button1Interrupt(self, callback=None, bouncetime=200):
        """Set up interrupt for button 1."""
        GPIO.add_event_detect(self.__pin1, GPIO.FALLING, callback=callback, bouncetime=bouncetime)

    def Button2Interrupt(self, callback=None, bouncetime=200):
        """Set up interrupt for button 2."""
        GPIO.add_event_detect(self.__pin2, GPIO.FALLING, callback=callback, bouncetime=bouncetime)

    def Button3Interrupt(self, callback=None, bouncetime=200):
        """Set up interrupt for button 3."""
        GPIO.add_event_detect(self.__pin3, GPIO.FALLING, callback=callback, bouncetime=bouncetime)

    def Button4Interrupt(self, callback=None, bouncetime=200):
        """Set up interrupt for button 4."""
        GPIO.add_event_detect(self.__pin4, GPIO.FALLING, callback=callback, bouncetime=bouncetime)

    def Cleanup(self):
        """Clean up GPIO settings."""
        GPIO.cleanup()
