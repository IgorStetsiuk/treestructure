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


    getRequest((data) => {
        data.sort((a, b) => {
            return a.parent - b.parent;
        });

        let nestedArray = createNestedArray(data);

        console.table(nestedArray)
    });

    function createNestedArray(sortedArray) {
        let result = [];

        sortedArray.forEach(item => {
            if (!item.parent) {
                result.push(item);
                return;
            }

            let parent = findParent(result, item);

            if (!parent.children) {
                parent.children = [];
            }

            parent.children.push(item);

        });

        return result;
    }

    function findParent(resultArray, item) {
        let result;

        for (let i = 0, l = resultArray.length; i < l; i++) {
            let parent = resultArray[i];

            if (parent.id === item.parent) {
                result = parent;
                break;
            }

            if (parent.children) {
                result = findParent(parent.children, item);

                if (result) break;
            }
        }

        return result;
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



