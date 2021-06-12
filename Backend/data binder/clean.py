import json

with open('all.txt','r',encoding='utf-8') as f:
    ok=f.readlines()

# with open('skills.json','w') as f:
#     f.write('{"data":[')
#     for i in range(len(ok)):
#         t='{"text": "'+str(ok[i][:-1])+'"},'
#         if i==len(ok)-1:
#             f.write(t[:-1])
#         else:
#             f.write(t)
#     f.write(']}')

dict={}
sl=10
nl=5

# with open('skills.json','r') as f:
#     data=f.read().replace('\n', '')
# dict=json.load(data)



for j in range(len(ok)):
    og=ok[j]
    ch=ok[j].lower()
    curr=dict
    count=0
    for i in ch:
        if count==nl:
            if og[:-1] in curr["top"]:
                break
            curr["top"].append(og[:-1])
            break
        if i in curr:
            if len(curr[i]["top"])<sl and og[:-1] not in curr[i]["top"]:
                curr[i]["top"].append(og[:-1])
            curr=curr[i]
        else:
            curr[i]={"top":[og[:-1]]}
            curr=curr[i]
        count+=1

# print(dict['b'])

tosearch="Brand"
temp=dict
tosearch=tosearch.lower()
for i in tosearch:
    print(len(temp))
    temp=temp[i]
temp=temp["top"]
print(len(temp))



with open("skills.json", "w") as f: 
    json.dump(dict, f,indent=2)

