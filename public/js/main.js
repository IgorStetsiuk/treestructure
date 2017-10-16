(function () {


    const postsContainer = document.getElementById('posts-container');
    const treeUlFragment = document.createDocumentFragment();
    const modal = document.getElementById('modal-window');
    const modalContent = modal.firstElementChild;


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
                ul.classList.add('post-children');
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

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nodeElement.addEventListener('click', (event) => {
            let choseNode = event.target;
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
        let findedPost = postsArray.find(el => {
            return postId == el.id;
        });

        modal.style.display = 'block';
        modal.querySelector('.text').innerHTML = findedPost.content;
    }

    //-- let the popup make draggable & movable.
    let shift = {x: 0, y: 0};

    modalContent.addEventListener('mousedown', mouseDown);

    function mouseDown(event) {
        shift.x = event.pageX - modalContent.offsetLeft;
        shift.y = event.pageY - modalContent.offsetTop;
        console.log(event.pageY);
        document.addEventListener('mousemove', modalMove, true);
    }

    function modalMove(event) {
        let left = event.pageX - shift.x;
        let top = event.pageY - shift.y;
        modalContent.style.top = top + 'px';
        modalContent.style.left = left + 'px';

    }

    document.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        document.removeEventListener('mousemove', modalMove, true);
        // modalContent.style.top = '50%';
        // modalContent.style.left = '50%';
    }
})();



