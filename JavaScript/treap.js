class TreapNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.priority = Math.floor(Math.random() * 101);
    }
}

class Split {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}

class Treap {
    constructor() {
        this.root = null;
    }

    search(key) {
        if (this.root == null)
            return null;
        return this._search(this.root, key);
    }

    _search(node, key) {
        if (node == null || node.key === key)
            return node;
        else if (key < node.key)
            return this._search(node.left, key);
        else
            return this._search(node.right, key);
    }

    lrotate(node) {
        let rchild = node.right;
        let temp = rchild.left;

        rchild.left = node;
        node.right = temp;

        return rchild;
    }

    rrotate(node) {
        let lchild = node.left;
        let temp = lchild.right;

        lchild.right = node;
        node.left = temp;

        return lchild;
    }

    insert(key) {
        this.root = this._insert(this.root, key);
    }

    _insert(node, key) {
        if (node == null)
            return new TreapNode(key);
        if (key < node.key)
            node.left = this._insert(node.left, key);
        else if (key >= node.key)
            node.right = this._insert(node.right, key);
        if (node.left != null && node.left.priority > node.priority)
            return this.rrotate(node);
        if (node.right != null && node.right.priority > node.priority)
            return this.lrotate(node);
        return node;
    }

    delete(key) {
        this.root = this._delete(this.root, key);
    }

    _delete(node, key) {
        if (node == null)
            return null;
        else if (key < node.key)
            node.left = this._delete(node.left, key);
        else if (key > node.key)
            node.right = this._delete(node.right, key);
        else {
            if (node.left == null && node.right == null)
                node = null;
            else if (node.left == null) {
                let temp = node.right;
                node = null;
                return temp;
            }
            else if (node.right == null) {
                let temp = node.left;
                node = null;
                return temp;
            }
            else {
                if (node.left.priority < node.right.priority) {
                    node = this.lrotate(node);
                    node.left = this._delete(node.left, key);
                }
                else {
                    node = this.rrotate(node);
                    node.right = this._delete(node.right, key);
                }
            }
        }
        return node;
    }

    _setChild(node, toLeft, child) {
        if (toLeft)
            node.left = child;
        else
            node.right = child;
    }

    split(key) {
        return this._split(this.root, key);
    }

    _split(node, key) {
        let root2 = null;
        let parent1 = null;
        let parent2 = null;

        // Determine at which side of the root we will travel
        let toLeft = node != null && key <= node.key;

        while (node != null) {
            while (node != null && (key <= node.key) === toLeft) {
                parent1 = node;
                if (toLeft)
                    node = node.left;
                else
                    node = node.right;
            }

            // Cut out the edge. root is now detached
            this._setChild(parent1, toLeft, null);

            // toggle direction
            toLeft = !toLeft;

            if (root2 == null)
            // This is the root of the other tree
                root2 = node;
            else if (parent2 != null)
            // re-attach the detached subtree
                this._setChild(parent2, toLeft, node);

            parent2 = parent1;
            parent1 = null;
        }

        let right = new Treap();
        right.root = root2;

        if (right.root != null && this.root.key < right.root.key)
            return new Split(this, right);
        return new Split(right, this);
    }

    merge(treap) {
        let inOrderToBeMerged = treap.inOrder();
        let key;
        for (key of inOrderToBeMerged)
            this.insert(key);
    }

    inOrder() {
        let inOrderList = [];
        this.inOrderHelper(this.root, inOrderList);
        return inOrderList;
    }

    inOrderHelper(node, inOrderList) {
        if(node != null){
            this.inOrderHelper(node.left, inOrderList);
            inOrderList.push(node.key);
            this.inOrderHelper(node.right, inOrderList);
        }
    }

    postOrder() {
        let postOrderList = [];
        this.postOrderHelper(this.root, postOrderList);
        return postOrderList;
    }

    postOrderHelper(node, postOrderList) {
        if(node != null){
            this.postOrderHelper(node.left, postOrderList);
            this.postOrderHelper(node.right, postOrderList);
            postOrderList.push(node.key);
        }
    }

    preOrder() {
        let preOrderList = [];
        this.preOrderHelper(this.root, preOrderList);
        return preOrderList;
    }


    preOrderHelper(node, preOrderList) {
        if(node != null){
            preOrderList.push(node.key);
            this.preOrderHelper(node.left, preOrderList);
            this.preOrderHelper(node.right, preOrderList);
        }
    }
}

const main = function () {
    let treap = new Treap();
    let arr = [12, 8, 19, 4, 5, 7, 9];

    for(x of arr) {
        treap.insert(x);
    }
    console.log(treap.search(5).key);

    treap.delete(5);
    console.log(treap.search(5));

    let split = treap.split(8);
    
    let left = split.left;
    console.log(left.inOrder());
    
    let right = split.right;
    console.log(right.inOrder());

    left.merge(right);
    console.log(left.inOrder());

};

main();