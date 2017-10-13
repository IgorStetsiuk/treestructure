(function () {


    const list = document.getElementById('posts-list');
    let treeFragment = document.createDocumentFragment();


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


    getRequest((data) => {
        data.sort((a, b) => {
            return a.parent - b.parent;
        });

        let nestedArray = createNestedArray(data);
        treeFragment.appendChild(nestedArray);
        list.appendChild(treeFragment);
        console.table(nestedArray)

    });

    function renderItem(item) {

        let liElement = document.createElement('li');

        liElement.classList.add( `post-${item.id}`);
        liElement.innerText = item.title ;

        return liElement;

    }

    function createNestedArray(sortedArray) {

        let resultUl = document.createElement('ul');

        console.table(sortedArray)


        sortedArray.forEach(item => {

            if (!item.parent) {
                resultUl.appendChild(renderItem(item));
                return;
            }

            let parent = resultUl.querySelector(`.post-${item.parent}`)

            if (!parent.children.length) {
                let ul = document.createElement('ul')
                parent.appendChild(ul);
            }

            parent.children[0].appendChild(renderItem(item))

        });


        return resultUl;
    }

    // function createNestedArray(sortedArray) {
    //     let result = [];
    //
    //     sortedArray.forEach(item => {
    //         if (!item.parent) {
    //             result.push(item);
    //             return;
    //         }
    //
    //         let parent = findParent(result, item);
    //
    //         if (!parent.children) {
    //             parent.children = [];
    //         }
    //
    //         parent.children.push(item);
    //
    //     });
    //
    //     return result;
    // }
    //
    // function findParent(resultArray, item) {
    //     let result;
    //
    //     for (let i = 0, l = resultArray.length; i < l; i++) {
    //         let parent = resultArray[i];
    //
    //         if (parent.id === item.parent) {
    //             result = parent;
    //             break;
    //         }
    //
    //         if (parent.children) {
    //            result = findParent(parent.children, item);
    //
    //            if (result) break;
    //         }
    //     }
    //
    //     return result;
    // }


})();



