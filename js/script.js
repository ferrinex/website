import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyBnbF6pCPI-JZjtXJ3w46Tmxe5HmiRxhKk",
authDomain: "ferrinex-7ee5e.firebaseapp.com",
projectId: "ferrinex-7ee5e",
storageBucket: "ferrinex-7ee5e.firebasestorage.app",
messagingSenderId: "129492497132",
appId: "1:129492497132:web:4a49ca4e5b54b80cbc2bc9"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");

const forbiddenWords = ["fuck","fucking","shit","bitch","damn"];


form.addEventListener("submit", async (e)=>{

e.preventDefault();

const name=document.getElementById("name").value.trim();
const feedback=document.getElementById("feedback").value.trim();

if(!name || !feedback){

message.style.display="block";
message.style.color="red";
message.innerText="Please fill all fields.";
return;

}

const lowerFeedback=feedback.toLowerCase();
const foundWord=forbiddenWords.find(word=>lowerFeedback.includes(word));

if(foundWord){

message.style.display="block";
message.style.color="red";
message.innerText="Please avoid using inappropriate words.";
return;

}

try{

await addDoc(collection(db,"feedback"),{
name:name,
feedback:feedback,
created:new Date()
});

message.style.display="block";
message.style.color="green";
message.innerText="Thank you for your feedback!";

form.reset();

loadFeedback();

}

catch(error){

message.style.display="block";
message.style.color="red";
message.innerText="Insert failed: "+error.message;

}

});



async function loadFeedback(){

const feedbackRef=collection(db,"feedback");

const q=query(feedbackRef,orderBy("created","desc"));

const querySnapshot=await getDocs(q);

let html="";
let index=0;

querySnapshot.forEach((doc)=>{

const row=doc.data();

const bgColor=index%2===0?"#f9f9f9":"#ffffff";

html+=`
<tr style="background:${bgColor}">
<td width="30%"><b>${row.name}</b></td>
<td>${row.feedback}</td>
</tr>
`;

index++;

});

document.getElementById("feedbackList").innerHTML=html;

}

loadFeedback();
