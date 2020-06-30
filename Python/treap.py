import random

random.seed(1)

class TreapNode:
    def __init__(self, key):
        self.key = key
        self.priority = random.randint(1, 100)
        self.left = None
        self.right = None

    def __repr__(self):
        return f'({self.key}, {self.priority})'

class Treap:
    def __init__(self):
        self.root = None

    def search(self, key):
        if self.root is None:
            return False
        node = self._search(self.root, key)
        if node:
            return node
        else:
            return False

    def _search(self, node, key):
        '''Recursive function to search the value in the Treap'''
        if node is None or node.key == key:
            return node

        elif key < node.key:
            return self._search(node.left, key)

        else:
            return self._search(node.right, key)

    def _lrotate(self, node):
        rchild = node.right
        temp = rchild.left

        rchild.left = node
        node.right = temp

        return rchild

    def _rrotate(self, node):
        lchild = node.left
        temp = lchild.right

        lchild.right = node
        node.left = temp

        return lchild

    def insert(self, key):
        self.root = self._insert(self.root, key)

    def _insert(self, node, key):
        '''Recursive function that inserts a value in an Treap.'''
        if node is None:
            return TreapNode(key)

        if key < node.key:
            node.left = self._insert(node.left, key)

        elif key >= node.key:
            node.right = self._insert(node.right, key)

        if node.left is not None and node.left.priority > node.priority:
            return self._rrotate(node)

        if node.right is not None and node.right.priority > node.priority:
            return self._lrotate(node)

        return node

    def delete(self, key):
        self.root = self._delete(self.root, key)

    def _delete(self, node, key):
        '''Recursive function to delete a node from the Treap.'''
        if node is None:
            return
        elif key < node.key:
            node.left = self._delete(node.left, key)
        elif key > node.key:
            node.right = self._delete(node.right, key)
        else:
            if node.left is None and node.right is None:
                node = None
            elif node.left is None:
                temp = node.right
                node = None
                return temp

            elif node.right is None:
                temp = node.left
                node = None
                return temp

            else:
                if node.left.priority < node.right.priority:
                    node = self._lrotate(node)
                    node.left = self._delete(node.left, key)
                else:
                    node = self._rrotate(node)
                    node.right = self._delete(node.right, key)

        return node

    def _set_child(self, node, to_left, child):
        if to_left:
            node.left = child
        else:
            node.right = child

    def split(self, key):
        '''
        Function that splits the original treap into twp
        parts at the key, left part contains key less than
        the key provided, and right part contains keys
        greater than or equal to the key.
        '''
        return self._split(self.root, key)

    def _split(self, node, key):
        root2 = None
        parent1 = None
        parent2 = None

        # Determine at which side of the root we will travel
        to_left = node is not None and key <= node.key

        while node is not None:
            while node is not None and (key <= node.key) == to_left:
                parent1 = node
                node = node.left if to_left else node.right

            # Cut out the edge. root is now detached
            self._set_child(parent1, to_left, None)

            # toggle direction
            to_left = not to_left

            if root2 is None:
                # This is the root of the other tree
                root2 = node
            elif parent2 is not None:
                # re-attach the detached subtree
                self._set_child(parent2, to_left, node)

            parent2 = parent1
            parent1 = None

        new_treap = Treap()
        new_treap.root = root2
        return (self, new_treap) if (new_treap.root is not None and \
                self.root.key < new_treap.root.key) else (new_treap, self)

    def merge(self, treap):
        '''Merges a given treap object into the current treap'''
        in_order_to_be_merged = treap.in_order()
        for key in in_order_to_be_merged:
            self.insert(key)

    def in_order(self):
        in_order_list = []
        self._in_order(self.root, in_order_list)
        return in_order_list

    def _in_order(self, node, in_order_list):
        '''Recursive In Order traversal of the tree'''
        if node is not None:
            self._in_order(node.left, in_order_list)
            in_order_list.append(node.key)
            self._in_order(node.right, in_order_list)

    def post_order(self):
        post_order_list = []
        self._post_order(self.root, post_order_list)
        return post_order_list

    def _post_order(self, node, post_order_list):
        '''Recursive Post Order traversal of the tree'''
        if node is not None:
            self._post_order(node.left, post_order_list)
            self._post_order(node.right, post_order_list)
            post_order_list.append(node.key)

    def pre_order(self):
        pre_order_list = []
        self._pre_order(self.root, pre_order_list)
        return pre_order_list

    def _pre_order(self, node, pre_order_list):
        '''Recursive Pre Order traversal of the tree'''
        if node is not None:
            pre_order_list.append(node.key)
            self._pre_order(node.left, pre_order_list)
            self._pre_order(node.right, pre_order_list)

    def __repr__(self):
        '''Function to pretty print the tree.
        
        src: https://github.com/pgrafov/python-avl-tree/blob/master/pyavltree.py#L448
        '''
        start_node = self.root
        sym, spaces_count = "-", 80
        op = ""
        init_str  = sym * spaces_count + "\n" 

        if not start_node:
            return "Treap is empty"

        else:
            level = [start_node]
            while (len([i for i in level if i is not None]) > 0):
                level_string = init_str

                for i in range(len(level)):
                    j = (i+1)* spaces_count // (len(level)+1)
                    level_string = level_string[:j] + (str(level[i]) if level[i] else sym) + level_string[j+1:]

                level_next = []

                for i in level:
                    level_next += ([i.left, i.right] if i else [None, None])

                level = level_next
                op += level_string

        return op


def main():
    treap = Treap()
    # li = [4, 5, 7, 9, 10, 13, 10, 19, 25, 15, 3]
    li = [12, 8, 19, 4, 5, 7, 9]
    for i in li:
        treap.insert(i)

    print(treap)
    assert treap.search(12).key == 12
    assert treap.search(20) == False

    treap.delete(4)

    assert treap.search(4) == False

    left, right = treap.split(10)

    print('Left Subtree:')
    print(left)

    print('Right Subtree:')
    print(right)

    left.merge(right)
    print(left)



if __name__ == '__main__':
    main()
