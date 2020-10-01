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

func main() {
	root := BSTNode{Data: 12}
	root.insert(1)
	root.insert(25)
}
