import json 

# 4 letter word in json format 
with open("word-list/words_dictionary.json", "r") as f:
    data = json.load(f)

valid_words = {word: value for word ,value in data.items() if len(word)==4}

with open("word-list/valid_words.json","w") as f:
    json.dump(valid_words,f,indent=4)

print(f"Found {len(valid_words)} four-letter words.")

# 4 letter words in txt format 
valid_word_list = [word for word in data if len(word) == 4]

with open("word-list/valid_word_list.txt","w") as f:
    for word in valid_word_list:
        f.write(word+"\n")

print(f"Found {len(valid_word_list)} four-letter words.")


# 4letter poople word list
unique_words = set()

with open("word-list/poop.txt","r") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
    
        word = line.split(",")[0].strip()
        unique_words.add(word)

    
with open("word-list/valid_poop.txt","w") as f:
    for word in sorted(unique_words):
        f.write(word+"\n")

print(f"Found {len(unique_words)} unique words.")


# what we can do is to connect word if they have 1 letter difference 
# Then draw a grpah 
# find the shortest point between two given nodes 
# solve the problem 
