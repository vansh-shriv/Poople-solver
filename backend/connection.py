import networkx as nx
import pickle 

G = nx.Graph()

# G.add_edge("A","B")
# G.add_edge("A","C")
# G.add_edge("B","D")

# print(G.nodes())
# print(list(G.neighbors("B")))

def connect(word1,word2):
    flag1 ,flag2,flag3,flag4 = False,False,False,False
    if(word1[0]==word2[0]):
        flag1 = True
    if(word1[1]==word2[1]):
        flag2 = True
    if(word1[2]==word2[2]):
        flag3 = True
    if(word1[3]==word2[3]):
        flag4 = True
    # now if one is false and three are true then we can connect this two words 
    if(not flag1 and flag2 and flag3 and flag4) : return True
    if(flag1 and not flag2 and flag3 and flag4) : return True
    if(flag1 and flag2 and not flag3 and flag4) : return True
    if(flag1 and flag2 and flag3 and not flag4) : return True
    else : return False

# to check coneect method is working or not 
# print(connect("poop","loop"))
# print(connect("abcd","acbd"))

# now we can connect the word and store in graph 

with open("word-list/valid_poop.txt","r") as f:
    words = [line.strip() for line in f]
print(len(words))

word_set = set(words)
for word in words:
    for i in range(len(word)):
        for c in "abcdefghijklmnopqrstuvwxyz":
            if c != word[i]:
                new_word = word[:i] + c + word[i+1:]
                if new_word in word_set:
                    G.add_edge(word, new_word)

with open("graph.pkl","wb") as f:
    pickle.dump(G,f)


