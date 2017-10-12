(function () {


    const list = document.getElementById('posts-list');


    function getRequest(callback) {

        let data;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/structure-source", true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    data = JSON.parse(xhr.responseText);
                    callback(data);
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);

    }

    // function render(item) {
    //     let postElement = document.createElement('li');
    //     postElement.className = 'post';
    //     let title = document.createElement('div');
    //     title.className = 'title';
    //     title.innerHTML = item.title;
    //     postElement.appendChild(title);
    //     return postElement;
    //
    // }

    function render(item) {

    }

    // function renderPosts(json) {
    //
    //     let data = json.tree;
    //
    //     for (let i = 0; i < data.length; i++) {
    //
    //         if (data[i].parent === null) {
    //            list.appendChild(render(data[i]));
    //
    //
    //         }
    //         else  if(data[i].parent===document.getElementsByClassName(`post ${i}`)){              console.log(  document.getElementsByClassName(`post ${i}`))
    //         }
    //
    //     }
    // }

    // getRequest(renderPosts);
    //
    //

    function rec(data, parentId) {

        let tree = document.createElement('ul')
        parentId = parentId || 1;

        let items = data.filter(function (el) {
            return el.parent == parentId;
        });
        if (items.length == 0) return null;


        items.forEach(el => {
            let li = document.createElement('li');
            li.className = `post ${el.id}`;

            let title = document.createElement('div');
            title.innerHTML = el.title;
            li.appendChild(title);


           tree.appendChild(li);

           let nestedTree = rec(data,el.id);
           if(nestedTree!==null ){
               li.appendChild(nestedTree);
           }
        })



        console.log(items);

        return tree;


    }


    function changeStructure(json) {
        let data = json.tree;

        console.log(rec(data))

    }

    getRequest(changeStructure);


})();

function createTree(item, parent) {


    let item = createTree()
}


// root.forEach(item=>{
//     posts.forEach(post=>{
//         if(item.id===post.parent){
//             item.child = post;
//             root.push(post.id);
//             newStructure.push(item);
//             console.log( item.id +' '+post.id);
//
//         }
//     })
// })

// let arrParrent = [];
//
// // data.tree.forEach((post) => {
// //
// //     if (!post.parent) {
// //         let postElement = document.createElement('li');
// //         postElement.className = 'post'+'-'+post.id;
// //
// //         let title = document.createElement('div');
// //         title.className = 'title';
// //         title.innerHTML = post.title;
// //
// //         postElement.appendChild(title);
// //         list.appendChild(postElement);
// //
// //         arrParrent.push(post)
// //     }
// // });