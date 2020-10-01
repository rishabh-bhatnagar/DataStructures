package main

type BSTNode struct {
	Data        int
	Left, Right *BSTNode
}

func (root *BSTNode) search(data int) *BSTNode {
	switch {
	case root.Left != nil && root.Data > data:
		return root.Left.search(data)
	case root.Right != nil && root.Data < data:
		return root.Right.search(data)
	case root.Data == data:
		return root
	default:
		return nil
	}
}

func (root *BSTNode) insert(data int) {
	switch {
	case root.Data > data:
		if root.Left == nil {
			root.Left = &BSTNode{Data: data}
		} else {
			root.Left.insert(data)
		}
	case root.Data < data:
		if root.Right == nil {
			root.Right = &BSTNode{Data: data}
		} else {
			root.Right.insert(data)
		}
	}
}

func (root *BSTNode) inorder() []int {
	var left, right []int
	if root.Left != nil {
		left = root.Left.inorder()
	}
	if root.Right != nil {
		right = root.Right.inorder()
	}
	return append(append(left, root.Data), right...)
}

func (root *BSTNode) preorder() []int {
	var left, right []int
	if root.Left != nil {
		left = root.Left.inorder()
	}
	if root.Right != nil {
		right = root.Right.inorder()
	}
	return append(append([]int{root.Data}, left...), right...)
}

func (root *BSTNode) postorder() []int {
	var left, right []int
	if root.Left != nil {
		left = root.Left.inorder()
	}
	if root.Right != nil {
		right = root.Right.inorder()
	}
	return append(append(left, right...), root.Data)
}

func (root *BSTNode) levelOrder() (seq []int) {
	queue := []*BSTNode{root}
	for len(queue) > 0 {
		currNode := queue[0]
		queue = queue[1:]
		if currNode != nil {
			seq = append(seq, currNode.Data)
			queue = append(queue, currNode.Left)
			queue = append(queue, currNode.Right)
		}
	}
	return seq
}

func main() {
	root := BSTNode{Data: 12}
	root.insert(1)
	root.insert(25)
}
