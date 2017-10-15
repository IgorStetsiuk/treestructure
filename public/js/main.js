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
                ul.classList.add('post-children')
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
        addEvents(postsContainer, data);
    });

    function addEvents(nodeElement, postsArray) {
        let closeButton = modal.querySelector('.close');
        let choseNode;

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nodeElement.addEventListener('click', (event) => {
            choseNode = event.target;
            let postId = choseNode.classList[0].substring(5);
            let childNode = choseNode.children[0];

            if (childNode) {
                childNode.classList.toggle('open');
                choseNode.style.borderLeft = 'none';
            }

            if (childNode && childNode.classList.contains('open')) {
                displayModalWindow(postsArray, postId);
                choseNode.style.borderLeft = '2px dashed black';
            } else if (!childNode) {
                displayModalWindow(postsArray, postId);
            }

        })
    }

    function displayModalWindow(postsArray, postId) {
        let result = postsArray.find(el => {
            return postId == el.id;
        });

        modal.style.display = 'block';
        modal.querySelector('.text').innerHTML = result.content;
    }

})();



