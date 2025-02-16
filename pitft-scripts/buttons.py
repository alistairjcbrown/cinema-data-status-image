import time
from pitftscreen import PiTFT_Screen

def button_callback(button_number):
    global backlight_state
    print(f"Button {button_number} pressed")

    if button_number == 1:
        backlight_state = not backlight_state
        screen.Backlight(backlight_state)

# Initialize the PiTFT screen
screen = PiTFT_Screen()

# Initialize backlight state
backlight_state = True  # Assuming we start with the backlight on
screen.Backlight(backlight_state)  # Ensure backlight is set to the initial state

# Set up button interrupts
screen.Button1Interrupt(lambda channel: button_callback(1))
screen.Button2Interrupt(lambda channel: button_callback(2))
screen.Button3Interrupt(lambda channel: button_callback(3))
screen.Button4Interrupt(lambda channel: button_callback(4))

try:
    # Main loop
    while True:
        time.sleep(0.1)  # Sleep to reduce CPU usage
except KeyboardInterrupt:
    print("Exiting program")
finally:
    screen.Cleanup()  # Clean up GPIO on exit
