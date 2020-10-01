//
// Created by RishabhBhatnagar on 01-10-2020.
//

#include <iostream>

using namespace ::std;

class Node {
public:
    Node *left, *right;
    int data;

    explicit Node(int data) {
        this->data = data;
        this->left = nullptr;
        this->right = nullptr;
    }
};

class BST {
    Node *insert(Node *new_node, Node *curr) {
        if (curr == nullptr)
            return new_node;
        if (new_node->data > curr->data)
            curr->right = insert(new_node, curr->right);
        else
            curr->left = insert(new_node, curr->left);
        return curr;
    }

    Node *search(Node *root, int data) {
        if (!root) return nullptr;
        if (root->data == data) return root;
        Node *from_left = search(root->left, data);
        if (from_left) return from_left;
        return search(root->right, data);
    }

    Node *successor(Node *root) {
        Node *curr = root->right;
        while (curr->left) {
            curr = curr->left;
        }
        return curr;
    }

    Node *remove(Node *root, int data) {
        if (!root)
            return nullptr; // data not found in the tree.
        if (root->data > data)
            root->left = remove(root->left, data);
        else if (root->data < data)
            root->right = remove(root->right, data);
        else {
            if (!root->left)
                return root->right;
            else if (!root->right)
                return root->left;
            Node *succ = successor(root);
            root->data = succ->data;
            return remove(root->right, succ->data);
        }
    }

public:
    Node *root;

    BST() {
        root = nullptr;
    };

    void insert(int data) {
        this->root = insert(new Node(data), root);
    }

    void remove(int data) {
        remove(root, data);
    }

    Node *search(int data) {
        return search(root, data);
    }
};


int main() {
    BST *tree = new BST();
    tree->insert(2);
    tree->insert(1);
    tree->insert(3);
    tree->remove(3);
    tree->insert(4);

    /*
     * Final Tree:
     *              2
     *            /   \
     *           1     4
     * */
}
