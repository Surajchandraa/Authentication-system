// fetch users from database



let url = "http://localhost:5000/fetch_user";
let url2 = "http://localhost:4000/search_api"
let maincontainer = document.getElementsByClassName("users")[0];
let search=document.getElementById("srch");
let submit=document.getElementById("submit");
let logout=document.getElementById("logout")



let data=fetch(url);
data.then((value)=>{
return value.json()
}).then((value)=>{
 value.forEach(element => {
    let create = document.createElement('div');
    create.classList.add("maincard")
    create.innerHTML=`<img src="profile_pic.png" alt="image">
    <div class="name"><p>${element.name}</p></div>`
    maincontainer.appendChild(create);

    // create.addEventListener("click",()=>{
    //     let idd = document.createElement('a');
    //     idd.href=`chat_room.html?id=${element._id}`;
    //     idd.click();
        
    //     // alert("you clicked on"+element.name+element._id)
   // })
 });
 });

submit.addEventListener("click",()=>{
    
    let name=search.value

    let fetchdata=fetch(`http://localhost:5000/search_api/${name}`
        
    )
    fetchdata.then(function(value){
        return value.json();
    }).then(function(value){
        console.log(value)
        if(value.length==0){
            alert("no user found of this name sorry")
        }
        else{

            maincontainer.innerHTML='';

            value.forEach(element => {
                let create = document.createElement('div');
                create.classList.add("maincard")
                create.innerHTML=`<img src="profile_pic.png" alt="image">
                <div class="name"><p>${element.name}</p></div>`
                maincontainer.appendChild(create);
                console.log(create)
            })

        }
    })
})




