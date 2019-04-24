import sys
import time
from dicttoxml import dicttoxml
import xmltodict

ROUNDS = 10000

def operation(serialize, deSerialize):
    obj = {
        "a": "1",
        "b": "2",
        "c": "3",
        "d": "4"
    }

    startSe = time.time()
    for i in range(0, ROUNDS):
        ser = serialize(obj)
    endSe = time.time()

    startDe = time.time()
    for i in range(0, ROUNDS):
        deser = deSerialize(ser)
    endDe = time.time()

    return [(endSe-startSe) / ROUNDS, (endDe-startDe) / ROUNDS]

def main():
    choice = menu()

    functionList = [[dicttoxml, xmltodict.parse], [], [], [], []]
    resultSe, resultDe = operation(functionList[choice - 1][0], functionList[choice - 1][1])

    print("10000 run average: ")
    print("Serialization: " + str(round(resultSe * 1000, 4)) + "ms")
    print("De-serialization: " + str(round(resultDe * 1000, 4)) + "ms")

def menu():
    print("Serialize and de-serialize")
    print("Formats")
    print("1) XML")
    print("2) JSON")
    print("3) MessagePack")
    print("4) YAML")
    print("5) PICKLE")
    print("0) EXIT")

    choice = int(input("Choose format: "))
    while True:
        if choice in range(0,6):
            if choice == 0:
                sys.exit()
            else:
                return choice
        else:
            print("Wrong input: ")

if __name__ == '__main__':
    main()
