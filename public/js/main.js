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
                    callback(data.tree);
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

    // function rec(data, parentId) {
    //
    //     let tree = document.createElement('ul');
    //     tree.className=parentId;
    //     parentId = parentId ||1;
    //
    //     let items = data.filter(function (el) {
    //         return el.parent === parentId;
    //     });
    //     if (items.length === 0 ) return null;
    //
    //     console.log(items);
    //
    //     items.forEach(el => {
    //         let li = document.createElement('li');
    //         li.className = `post ${el.id}`;
    //         let title = document.createElement('div');
    //         title.innerHTML = el.title;
    //
    //         li.appendChild(title);
    //         tree.appendChild(li);
    //
    //         let nestedTree = rec(data, el.id);
    //         if (nestedTree !== null) {
    //             li.appendChild(nestedTree);
    //         }
    //     });
    //
    //     return tree;
    // }

    getRequest(getRoot);

    function getRoot(data) {
        for (let i = 0; i < data.length; i++) {
            if (!data[i].parent) {
                render(data[i]);
            }

            if (data[i].parent) {
                let elem = document.getElementsByClassName(`post-${data[i].parent}`);
                list.insertBefore(elem[0], list.children[0]);
            }
        }
    }

    function render(item) {
        let div = document.createElement('div');
        div.className = `post-${item.id}`;
        let title = document.createElement('div');
        title.innerHTML = item.title;
        div.appendChild(title);
        list.appendChild(div);
    }

    // function render(data) {
    //     data.forEach((el)=>{
    //         let newRec = rec(data,el.id);
    //         if(newRec===null){
    //             let ul = document.createElement('ul');
    //             ul.className =el.id;
    //             let title = document.createElement('div');
    //             title.innerHTML = el.title;
    //             ul.appendChild(title);
    //             list.appendChild(ul);
    //         }else {
    //             list.appendChild(newRec);
    //         }
    //     });
    // };
})();



