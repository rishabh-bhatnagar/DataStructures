import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

class TreapNode {
    public int key;
    public int priority;
    public TreapNode left;
    public TreapNode right;

    public TreapNode(int key, int priority) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.priority = priority;
    }
}

public class Treap {
    public TreapNode root;

    public Treap() {
        this.root = null;
    }

    public TreapNode search(int key) {
        if (this.root == null)
            return null;
        return search(this.root, key);
    }

    private TreapNode search(TreapNode node, int key) {
        if (node == null || node.key == key)
            return node;
        else if (key < node.key)
            return search(node.left, key);
        else
            return search(node.right, key);
    }

    private TreapNode lrotate(TreapNode node) {
        TreapNode rchild = node.right;
        TreapNode temp = rchild.left;

        rchild.left = node;
        node.right = temp;

        return rchild;
    }

    private TreapNode rrotate(TreapNode node) {
        TreapNode lchild = node.left;
        TreapNode temp = lchild.right;

        lchild.right = node;
        node.left = temp;

        return lchild;
    }

    public void insert(int key, int priority) {
        this.root = insert(this.root, key, priority);
    }

    private TreapNode insert(TreapNode node, int key, int priority) {
        if (node == null)
            return new TreapNode(key, priority);
        if (key < node.key)
            node.left = insert(node.left, key, priority);
        else
            node.right = insert(node.right, key, priority);
        if (node.left != null && node.left.priority > node.priority)
            return rrotate(node);
        if (node.right != null && node.right.priority > node.priority)
            return lrotate(node);
        return node;
    }

    public void delete(int key) {
        this.root = delete(this.root, key);
    }

    private TreapNode delete(TreapNode node, int key) {
        if (node == null)
            return null;
        else if (key < node.key)
            node.left = delete(node.left, key);
        else if (key > node.key)
            node.right = delete(node.right, key);
        else {
            if (node.left == null && node.right == null)
                node = null;
            else if (node.left == null) {
                TreapNode temp = node.right;
                node = null;
                return temp;
            }
            else if (node.right == null) {
                TreapNode temp = node.left;
                node = null;
                return temp;
            }
            else {
                if (node.left.priority < node.right.priority) {
                    node = lrotate(node);
                    node.left = delete(node.left, key);
                }
                else {
                    node = rrotate(node);
                    node.right = delete(node.right, key);
                }
            }
        }
        return node;
    }

    private void setChild(TreapNode node, boolean toLeft, TreapNode child) {
        if (toLeft)
            node.left = child;
        else
            node.right = child;
    }

    public Split split(int key) {
        return split(this.root, key);
    }

    private Split split(TreapNode node, int key) {
        TreapNode root2 = null;
        TreapNode parent1 = null;
        TreapNode parent2 = null;

        // Determine at which side of the root we will travel
        boolean toLeft = node != null && key <= node.key;

        while (node != null) {
            while (node != null && (key <= node.key) == toLeft) {
                parent1 = node;
                node = toLeft ? node.left : node.right;
            }
            // Cut out the edge. root is now detached
            setChild(parent1, toLeft, null);
            // toggle direction
            toLeft = !toLeft;
            if (root2 == null) {
                // This is the root of the other tree.
                root2 = node;
            } else if (parent2 != null) {
                setChild(parent2, toLeft, node); // re-attach the detached subtree
            }
            parent2 = parent1;
            parent1 = null;
        }

        Treap right = new Treap();
        right.root = root2;
        if (right.root != null && this.root.key < right.root.key)
            return new Split(this, right);
        return new Split(right, this);
    }

    public void merge(Treap treap) {
        Random r = new Random();
        r.setSeed(1);
        List<Integer> inOrderToMerge = treap.inOrder();
        for(int key : inOrderToMerge) {
            insert(key, r.nextInt(101));
        }
    }

    public List<Integer> inOrder() {
        List<Integer> inOrderList = new ArrayList<>();
        inOrder(this.root, inOrderList);
        return inOrderList;
    }

    public void inOrder(TreapNode node, List<Integer> inOrderList) {
        if(node != null){
            inOrder(node.left, inOrderList);
            inOrderList.add(node.key);
            inOrder(node.right, inOrderList);
        }
    }
}

class Split {
    public Treap left;
    public Treap right;

    public Split(Treap left, Treap right) {
        this.left = left;
        this.right = right;
    }
}

/**
 * Utility class to pretty print the BST.
 *
 * https://stackoverflow.com/questions/4965335/how-to-print-binary-tree-diagram/29704252
 *
 */
class TreePrinter {

    public static void printNode(TreapNode root) {
        int maxLevel = TreePrinter.maxLevel(root);

        printNodeInternal(Collections.singletonList(root), 1, maxLevel);
    }

    private static void printNodeInternal(List<TreapNode> nodes, int level, int maxLevel) {
        if (nodes.isEmpty() || TreePrinter.isAllElementsNull(nodes))
            return;

        int floor = maxLevel - level;
        int edgeLines = (int) Math.pow(2, (Math.max(floor - 1, 0)));
        int firstSpaces = (int) Math.pow(2, (floor)) - 1;
        int betweenSpaces = (int) Math.pow(2, (floor + 1)) - 1;

        TreePrinter.printWhitespaces(firstSpaces);

        List<TreapNode> newNodes = new ArrayList<>();
        for (TreapNode node : nodes) {
            if (node != null) {
                System.out.print(node.key);
                newNodes.add(node.left);
                newNodes.add(node.right);
            } else {
                newNodes.add(null);
                newNodes.add(null);
                System.out.print(" ");
            }

            TreePrinter.printWhitespaces(betweenSpaces);
        }
        System.out.println("");

        for (int i = 1; i <= edgeLines; i++) {
            for (TreapNode node : nodes) {
                TreePrinter.printWhitespaces(firstSpaces - i);
                if (node == null) {
                    TreePrinter.printWhitespaces(edgeLines + edgeLines + i + 1);
                    continue;
                }

                if (node.left != null)
                    System.out.print("/");
                else
                    TreePrinter.printWhitespaces(1);

                TreePrinter.printWhitespaces(i + i - 1);

                if (node.right != null)
                    System.out.print("\\");
                else
                    TreePrinter.printWhitespaces(1);

                TreePrinter.printWhitespaces(edgeLines + edgeLines - i);
            }

            System.out.println("");
        }

        printNodeInternal(newNodes, level + 1, maxLevel);
    }

    private static void printWhitespaces(int count) {
        for (int i = 0; i < count; i++)
            System.out.print(" ");
    }

    private static int maxLevel(TreapNode node) {
        if (node == null)
            return 0;

        return Math.max(TreePrinter.maxLevel(node.left), TreePrinter.maxLevel(node.right)) + 1;
    }

    private static boolean isAllElementsNull(List list) {
        for (Object object : list) {
            if (object != null)
                return false;
        }
        return true;
    }

    private void setChild(TreapNode node, boolean toLeft, TreapNode child) {
        if (toLeft)
            node.left = child;
        else
            node.right = child;
    }

}

class App {
    public static void main(String[] args) {
        Random r = new Random();
        r.setSeed(1);
        Treap treap = new Treap();
        int [] li = {12, 8, 19, 4, 5, 7, 9};

        for (int x : li) {
            treap.insert(x, r.nextInt(101));
        }

        assert treap.search(5).key == 5;

        treap.delete(5);

        assert treap.search(5) == null;

        Split split = treap.split(8);

        System.out.println("Left Subtree");
        Treap left = split.left;
        TreePrinter.printNode(left.root);

        System.out.println("Right Subtree");
        Treap right = split.right;
        TreePrinter.printNode(right.root);

        System.out.println("Merging");
        left.merge(right);
        TreePrinter.printNode(left.root);
    }
}
