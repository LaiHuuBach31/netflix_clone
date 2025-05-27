import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Space, Checkbox, Button } from 'antd';
import { Role } from '../../services/roleService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchPermissions } from '../../store/permissionSlice';
import { Permission } from '../../services/permissionService';
import { createRolePermission, fetchRolePermissions, deleteRolePermission } from '../../store/rolePermissionSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { RolePermission } from '../../services/rolePermissionService';

interface AssignPermissionProps {
    isModalOpen: boolean;
    role: Role | null;
    onClose: () => void;
}

const AssignPermission: React.FC<AssignPermissionProps> = ({ isModalOpen, role, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePermissions, setHasMorePermissions] = useState(true);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [lastPagePermissions, setLastPagePermissions] = useState<number | null>(null);
    const [currentRolePermissionPage, setCurrentRolePermissionPage] = useState(1);
    const [hasMoreRolePermissions, setHasMoreRolePermissions] = useState(true);
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
    const [lastPageRolePermissions, setLastPageRolePermissions] = useState<number | null>(null);
    const { response: permissionResponse, loading: permissionLoading, error: permissionError } = useSelector((state: RootState) => state.permission);
    const { response: rolePermissionResponse } = useSelector((state: RootState) => state.role_permission);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const modalBodyRef = useRef<HTMLDivElement | null>(null);
    const itemsPerPage = 10;
    const isLoadingRef = useRef(false);

    useEffect(() => {
        if (isModalOpen && role && role.id) {
            setPermissions([]);
            setCurrentPage(1);
            setHasMorePermissions(true);
            setLastPagePermissions(null);
            setRolePermissions([]);
            setCurrentRolePermissionPage(1);
            setHasMoreRolePermissions(true);
            setLastPageRolePermissions(null);
            isLoadingRef.current = true;
            dispatch(fetchPermissions({ page: 1, keyword: '', limit: itemsPerPage }))
                .finally(() => {
                    isLoadingRef.current = false;
                });
            dispatch(fetchRolePermissions({ page: 1, keyword: role.id.toString() }));
        }
    }, [isModalOpen, role, dispatch]);

    useEffect(() => {
        if (permissionResponse && !permissionLoading) {
            setLastPagePermissions(permissionResponse.last_page);
            const newPermissions = permissionResponse.data.filter((newPerm: Permission) => 
                !permissions.some((perm) => perm.id === newPerm.id)
            );
            setPermissions((prev) => [...prev, ...newPermissions]);
            setHasMorePermissions(permissionResponse.current_page < permissionResponse.last_page);
        }
    }, [permissionResponse, permissionLoading]);

    useEffect(() => {
        if (rolePermissionResponse) {
            setLastPageRolePermissions(rolePermissionResponse.last_page);
            const newRolePermissions = rolePermissionResponse.data.filter(
                (newRp: any) => !rolePermissions.some((rp) => rp.id === newRp.id)
            );
            setRolePermissions((prev) => [...prev, ...newRolePermissions]);
            setHasMoreRolePermissions(rolePermissionResponse.current_page < rolePermissionResponse.last_page);
            if (rolePermissionResponse.current_page < rolePermissionResponse.last_page && role && role.id) {
                const nextRolePermissionPage = rolePermissionResponse.current_page + 1;
                dispatch(fetchRolePermissions({ page: nextRolePermissionPage, keyword: role.id.toString() }));
                setCurrentRolePermissionPage(nextRolePermissionPage);
            }
        }
    }, [rolePermissionResponse, role]);

    const loadMorePermissions = useCallback(() => {
        if (permissionLoading || !hasMorePermissions || isLoadingRef.current) {
            return;
        }
        if (lastPagePermissions && currentPage >= lastPagePermissions) {
            setHasMorePermissions(false);
            return;
        }
        const nextPage = currentPage + 1;
        isLoadingRef.current = true;
        setCurrentPage(nextPage);
        dispatch(fetchPermissions({ page: nextPage, keyword: '', limit: itemsPerPage }))
            .finally(() => {
                isLoadingRef.current = false;
            });
    }, [permissionLoading, hasMorePermissions, currentPage, lastPagePermissions, dispatch]);

    useEffect(() => {
        if (!loadMoreRef.current || !isModalOpen) return;
        const observerInstance = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMorePermissions && !permissionLoading && !isLoadingRef.current) {
                    loadMorePermissions();
                }
            },
            { threshold: 0.1 } 
        );
        observerInstance.observe(loadMoreRef.current);
        return () => {
            if (loadMoreRef.current && observerInstance) {
                observerInstance.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMorePermissions, hasMorePermissions, permissionLoading, isModalOpen]);

    useEffect(() => {
        const modalBody = modalBodyRef.current;
        if (!modalBody || !isModalOpen) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = modalBody;
            const distanceToBottom = scrollHeight - scrollTop - clientHeight;
            if (distanceToBottom < 50 && hasMorePermissions && !permissionLoading && !isLoadingRef.current) {
                loadMorePermissions();
            }
        };
        modalBody.addEventListener('scroll', handleScroll); 
        return () => modalBody.removeEventListener('scroll', handleScroll);
    }, [hasMorePermissions, permissionLoading, isModalOpen, loadMorePermissions]);

    const handlePermissionChange = (permission: Permission, checked: boolean, role_id: number) => {
        const data = {
            role_id: role_id,
            permission_id: permission.id
        };

        if (checked && permission) {
            dispatch(createRolePermission(data))
                .unwrap()
                .then((response) => {
                    showSuccessToast('Assign permission success');
                    setRolePermissions((prev) => [
                        ...prev,
                        { id: response.data.id, role_id, permission_id: permission.id }
                    ]);
                })
                .catch((error) => {
                    showErrorToast('Assign permission failed');
                    console.error('Assign permission failed:', error);
                });
        } else {
            const rolePermission = rolePermissions.find(
                (rp) => rp.role_id === role_id && rp.permission_id === permission.id
            );
            if (rolePermission) {
                dispatch(deleteRolePermission(rolePermission.id))
                    .unwrap()
                    .then(() => {
                        showSuccessToast('Revoke permission success');
                        setRolePermissions((prev) => prev.filter((rp) => rp.id !== rolePermission.id));
                    })
                    .catch((error) => {
                        showErrorToast('Revoke permission success');
                        console.error('deleteRolePermission failed:', error);
                    });
            } else {
                console.log('No rolePermission found to delete for role_id:', role_id, 'permission_id:', permission.id);
            }
        }
    };

    const handleAssignPermissions = () => {
        onClose();
    };

    return (
        <Modal
            title={`Assign Permissions to: ${role?.name}`}
            open={isModalOpen}
            onOk={handleAssignPermissions}
            onCancel={onClose}
            okText="Assign"
            cancelText="Cancel"
        >
            <div ref={modalBodyRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {permissions.map((perm) => (
                        <Checkbox
                            key={perm.id}
                            checked={rolePermissions.some(
                                (rp) => rp.permission_id === perm.id && rp.role_id === role?.id
                            ) || false}
                            onChange={(e) => {
                                if (role && role.id) {
                                    handlePermissionChange(perm, e.target.checked, role.id);
                                } else {
                                    console.error('Role or role.id is undefined');
                                }
                            }}
                        >
                            {perm.name}
                        </Checkbox>
                    ))}
                    {permissionLoading && <div>Loading more permissions...</div>}
                    {permissionError && <div>Error:</div>}
                    {!hasMorePermissions && <div>Total permissions loaded: {permissions.length} (No more to load)</div>}
                    <div ref={loadMoreRef} style={{ height: '20px', background: 'transparent' }} />
                </Space>
            </div>
        </Modal>
    );
};

export default AssignPermission;