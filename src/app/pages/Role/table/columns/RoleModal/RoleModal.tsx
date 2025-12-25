import { Modal, Button, Form } from "react-bootstrap"
import { useState, useEffect } from "react"
import CheckboxTree from "react-checkbox-tree"
import 'react-checkbox-tree/lib/react-checkbox-tree.css'

import {
  FaFolder,
  FaFolderOpen,
  FaFileCode,
  FaMinusSquare,
  FaPlusSquare
} from "react-icons/fa"
import { getAllMenu } from "../../../../../controllers/Menu/MenuController"

interface RoleModalProps {
  show: boolean
  onClose: () => void
  role?: {
    RoleID: number;
    RoleName: string;
    Symbol: string;
    Status: number;
    listRoleMenu: FlatMenuItem[];
  }
  onSave: (updatedData: {
    RoleName: string;
    Symbol: string;
    IsActive: boolean;
    MenuIds: number[];
    AllMenus: FlatMenuItem[];
  }) => void;
}

interface FlatMenuItem {
  MenuID: number
  MenuName: string
  ParentId: number | null
  IsChecked: boolean
}

export const RoleModal = ({ show, onClose, role, onSave }: RoleModalProps) => {
  const [roleName, setRoleName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [isActive, setIsActive] = useState(show)
  const [menuIds, setMenuIds] = useState<number[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [treeNodes, setTreeNodes] = useState<any[]>([])
  const [flatMenuList, setFlatMenuList] = useState<FlatMenuItem[]>([]) // 👈 Flat menu lưu toàn bộ

  useEffect(() => {
    const fetchData = async () => {
      let data: FlatMenuItem[] = []

      if (role?.listRoleMenu) {
        data = role.listRoleMenu
        setMenuIds(data.filter(m => m.IsChecked).map(m => m.MenuID))
      } else {
        try {
          const response = await getAllMenu()
          data = response.Data || []
          setMenuIds([]) // Không check gì cả khi tạo mới
        } catch (error) {
          console.error("Lỗi khi lấy danh sách menu:", error)
        }
      }

      setFlatMenuList(data) // 👈 Lưu flat list menu vào state
      setRoleName(role?.RoleName || "")
      setSymbol(role?.Symbol || "")
      setIsActive(role ? role.Status === 1 : true)

      const tree = buildTree(data)
      setTreeNodes(tree)
      setExpanded(getAllParentNodeIds(tree))
    }

    if (show) fetchData()
  }, [role, show])

  const buildTree = (items: FlatMenuItem[]) => {
    const idMap = new Map<number, any>()
    const roots: any[] = []

    items.forEach(item => {
      idMap.set(item.MenuID, {
        value: item.MenuID.toString(),
        label: item.MenuName,
        raw: item,
        children: []
      })
    })

    items.forEach(item => {
      const node = idMap.get(item.MenuID)
      if (item.ParentId !== null) {
        const parent = idMap.get(item.ParentId)
        if (parent) {
          parent.children.push(node)
        }
      }
    })

    idMap.forEach((node) => {
      if (node.children.length === 0) delete node.children
    })

    idMap.forEach((node) => {
      if (!node.raw.ParentId) {
        roots.push(node)
      }
    })

    return roots
  }

  const getAllParentNodeIds = (nodes: any[]): string[] => {
    let result: string[] = []
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        result.push(node.value)
        result = result.concat(getAllParentNodeIds(node.children))
      }
    })
    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      RoleName: roleName,
      Symbol: symbol,
      IsActive: isActive,
      MenuIds: menuIds,
      AllMenus: flatMenuList, // 👈 Truyền flat list menu ra ngoài
    }

    onSave(formData)
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{role ? "Cập nhật Quyền" : "Thêm Quyền"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            {/* LEFT */}
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Tên quyền</Form.Label>
                <Form.Control
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Ký hiệu</Form.Label>
                <Form.Control
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold me-5">Kích hoạt</Form.Label>
                <Form.Check
                  type="switch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
            </div>

            {/* RIGHT */}
            <div className="col-md-6">
              <Form.Label className="required fw-bold">Menu</Form.Label>
              <div className="border rounded p-2" style={{ maxHeight: 400, overflowY: "auto" }}>
                <CheckboxTree
                  nodes={treeNodes}
                  checked={menuIds.map(String)}
                  expanded={expanded}
                  onCheck={(checked) => setMenuIds(checked.map(Number))}
                  onExpand={setExpanded}
                  icons={{
                    halfCheck: <FaMinusSquare />,
                    expandClose: <FaMinusSquare />,
                    expandOpen: <FaPlusSquare />,
                    parentClose: <FaFolder />,
                    parentOpen: <FaFolderOpen />,
                    leaf: <FaFileCode />,
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            Trở về
          </Button>
          <Button type="submit" variant="primary">
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
