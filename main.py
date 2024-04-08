import pyaudio
import speech_recognition as sr

recognizer = sr.Recognizer()

with sr.Microphone() as source:
    print("Listening...")
    audio_Data = recognizer.listen(source)
    print("Recognizing...")

    try:
        text = recognizer.recognize_google(audio_Data)
        print("Text: " + text)

        with open("lecture_notes.txt", "a") as file:
            file.write(text + "\n")
            file.write("\n")

    except sr.UnknownValueError:
        print("Our speech recognition could not understand the given audio")
    
    except sr.RequestError as e:
        print(f"Could not request results from our speech recognizing software")