(function () {


    const postsContainer = document.getElementById('posts-container');
    const treeUlFragment = document.createDocumentFragment();
    const modal = document.getElementById('modal-window');

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

    function buildTree(data) {
        let resultUl = document.createElement('ul');

        resultUl.id = 'posts-list';
        data.forEach(post => {
            if (!post.parent) {
                resultUl.appendChild(renderPost(post));
                return;
            }

            let parent = resultUl.querySelector(`.post-${post.parent}`);

            if (!parent.children[0]) {
                let ul = document.createElement('ul');

                ul.appendChild(renderPost(post));
                parent.appendChild(ul);
            } else {
                parent.children[0].appendChild(renderPost(post));
            }
        });

        return resultUl;
    }


    function renderPost(post) {
        let li = document.createElement('li');
        li.classList.add(`post-${post.id}`);
        li.textContent = `${post.id} ${post.title}`;

        return li;
    }

    getRequest((data) => {
        let resultTree = buildTree(data);

        treeUlFragment.appendChild(resultTree);
        postsContainer.appendChild(treeUlFragment);
        createEvents(postsContainer, data);
    });


    function createEvents(nodeElement, array) {
        let content;
        let closeButton = modal.querySelector('.close');

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });


        nodeElement.addEventListener('click', (event) => {

            let elementClass = event.target.classList[0];
            let elementId = elementClass.substring(5);
            let result = array.find(el => {
                return elementId == el.id;
            });
            modal.style.display = 'block';
            modal.querySelector('.text').innerHTML = result.content;
            console.log(result)
        })
    }


})();



