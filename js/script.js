import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

console.log("Ferrinex feedback script running");

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


/* FORM SUBMIT */

if(form){

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const name=document.getElementById("name").value.trim();
const email=document.getElementById("email").value.trim();
const product=document.getElementById("product").value;
const feedback=document.getElementById("feedback").value.trim();

if(!name || !email || !product || !feedback){

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
email:email,
product:product,
feedback:feedback,
created:serverTimestamp()
});

message.style.display="block";
message.style.color="green";
message.innerText="Thank you for your feedback!";

form.reset();

loadFeedback();

}

catch(error){

console.error(error);

message.style.display="block";
message.style.color="red";
message.innerText="Insert failed: "+error.message;

}

});

}


/* LOAD FEEDBACK */

async function loadFeedback(){

const feedbackList=document.getElementById("feedbackList");

if(!feedbackList) return;

try{

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
<td><b>${row.name}</b></td>
<td>${row.email}</td>
<td>${row.product}</td>
<td>${row.feedback}</td>
</tr>
`;

index++;

});

feedbackList.innerHTML=html;

}

catch(error){

console.error("Error loading feedback:",error);

}

}

loadFeedback();
