(function () {


    const postsContainer = document.getElementById('posts-container');
    const treeUlFragment = document.createDocumentFragment();
    const modalWindow = document.getElementById('modal-window');
    const modalContent = modalWindow.getElementsByClassName('modal-content')[0];
    const modalHeader = modalContent.getElementsByClassName('modal-head')[0];
    const resizer = modalContent.lastElementChild;
    const closeButton = modalWindow.querySelector('.close');


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

    function displayContent(nodeElement, postsArray) {

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
        });
    }

    function displayModalWindow(postsArray, postId) {

        let findedPost = postsArray.find(el => {
            return postId == el.id;
        });
        modalWindow.style.display = 'block';
        modalWindow.querySelector('.text').innerHTML = findedPost.content;


    }

    getRequest((data) => {
        let resultTree = buildTree(data);

        treeUlFragment.appendChild(resultTree);
        postsContainer.appendChild(treeUlFragment);
        displayContent(postsContainer, data);
    });


    modalHeader.addEventListener('mousedown', dragModal);
    modalContent.addEventListener('mouseup', stopMoveModal);

    resizer.addEventListener('mousedown', resizeInit);

    closeButton.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });

    //-- let the popup make draggable & movable.
    let shift = {x: 0, y: 0};

    function dragModal(event) {
        shift.x = event.pageX - modalContent.offsetLeft;
        shift.y = event.pageY - modalContent.offsetTop;
        console.log(event.pageY);
        modalContent.addEventListener('mousemove', moveModal, true);
        // event.stopImmediatePropagation();
    }

    function moveModal(event) {
        let left = event.pageX - shift.x;
        let top = event.pageY - shift.y;
        modalContent.style.top = top + 'px';
        modalContent.style.left = left + 'px';

    }

    function stopMoveModal() {
        modalContent.removeEventListener('mousemove', moveModal, true);

    }

    // modal window can change size
    let resize = {startX: 0, startY: 0, startHeight: 0, startWidth: 0};

    function resizeInit(event) {
        resize.startX = event.clientX;
        resize.startY = event.clientY;
        resize.startHeight = parseInt(getComputedStyle(modalContent).height, 10);
        resize.startWidth = parseInt(getComputedStyle(modalContent).width, 10);

        modalContent.addEventListener('mousemove', doResizeModal, false);
        modalContent.addEventListener('mouseup', stopResizeModal, false);
        // event.stopImmediatePropagation();
    }

    function doResizeModal(e) {
        modalContent.style.width = (resize.startWidth + e.clientX - resize.startX) + 'px';
        modalContent.style.height = (resize.startHeight + e.clientY - resize.startY) + 'px';

    }

    function stopResizeModal() {
        modalContent.removeEventListener('mousemove', doResizeModal);
        modalContent.removeEventListener('mouseup', stopResizeModal);
    }


})();



