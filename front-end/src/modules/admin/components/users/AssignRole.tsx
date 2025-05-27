import React, { useCallback, useEffect, useRef, useState } from 'react'
import { User } from '../../services/userService'
import { Checkbox, Modal, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchRoles } from '../../store/roleSlice';
import { Role } from '../../services/roleService';
import { createUserRole, deleteUserRole, fetchUserRoles } from '../../store/userRoleSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { UserRole } from '../../services/userRoleService';
import { fetchUsers } from '../../store/userSlice';

interface AssignRoleProps {
    isModalOpen: boolean;
    user: User | null;
    onClose: () => void;
}
const AssignRole: React.FC<AssignRoleProps> = ({ isModalOpen, user, onClose }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [roles, setRoles] = useState<Role[]>([]);
    const [hasMoreRoles, setHasMoreRoles] = useState<boolean>(true);
    const [lastPageRoles, setLastPageRoles] = useState<number | null>(null);
    const [currentUserRolePage, setCurrentUserRolePage] = useState<number>(1);
    const [hasMoreUserRoles, setHasMoreUserRoles] = useState<boolean>(true);
    const [lastPageUserRoles, setLastPageUserRoles] = useState<number | null>(null);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const { response: roleResponse, loading: roleLoading, error: roleError } = useSelector((state: RootState) => state.role);
    const { response: userRoleResponse } = useSelector((state: RootState) => state.user_role);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const modalBodyRef = useRef<HTMLDivElement | null>(null);
    const isLoadingRef = useRef(false);


    useEffect(() => {
        if (isModalOpen && user && user.id) {
            setRoles([]);
            setCurrentPage(1);
            setHasMoreRoles(true);
            setLastPageRoles(null);
            setUserRoles([]);
            setCurrentUserRolePage(1);
            setHasMoreUserRoles(true);
            setLastPageUserRoles(null);
            isLoadingRef.current = true;
            dispatch(fetchRoles({ page: 1, keyword: '' }))
                .finally(() => {
                    isLoadingRef.current = false;
                })
            dispatch(fetchUserRoles({ page: 1, keyword: '' }));
        }
    }, [isModalOpen, dispatch, user]);

    useEffect(() => {
        if (roleResponse && !roleLoading) {
            setLastPageRoles(roleResponse.last_page);
            const newRoles = roleResponse.data.filter((newRole: Role) =>
                !roles.some((role) => role.id === newRole.id)
            );
            setRoles((prev) => [...prev, ...newRoles]);
            setHasMoreRoles(roleResponse.current_page < roleResponse.last_page);
        }
    }, [roleResponse, roleLoading]);

     useEffect(() => {
        if (userRoleResponse) {
        
            setLastPageUserRoles(userRoleResponse.last_page);
            const newUserRoles = userRoleResponse.data.filter(
                (newUr: UserRole) => !userRoles.some((ur) => ur.id === newUr.id)
            );
            setUserRoles((prev) => [...prev, ...newUserRoles]);
            setHasMoreUserRoles(userRoleResponse.current_page < userRoleResponse.last_page);
            if (userRoleResponse.current_page < userRoleResponse.last_page && user && user.id) {
                const nextUserRolePage = userRoleResponse.current_page + 1;
                dispatch(fetchUserRoles({ page: nextUserRolePage, keyword: user.id.toString() }));
                setCurrentUserRolePage(nextUserRolePage);
            }
        }
    }, [userRoleResponse, user]);

    const loadMoreRoles = useCallback(() => {
        if (roleLoading || !hasMoreRoles || isLoadingRef.current) {
            return;
        }
        if (lastPageRoles && currentPage > lastPageRoles) {
            setHasMoreRoles(false);
            return;
        }
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        dispatch(fetchRoles({ page: nextPage, keyword: '' }))
            .finally(() => {
                isLoadingRef.current = false;
            })
    }, [roleLoading, hasMoreRoles, currentPage, lastPageRoles, dispatch]);

    useEffect(() => {
        if (!loadMoreRef.current || !isModalOpen) return;
        const observerInstance = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreRoles && !roleLoading && !isLoadingRef.current) {
                    loadMoreRoles();
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
    }, [loadMoreRoles, hasMoreRoles, roleLoading, isModalOpen]);

    useEffect(() => {
        const modalBody = modalBodyRef.current;
        if (!modalBody || !isModalOpen) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = modalBody;
            const distanceToBottom = scrollHeight - scrollTop - clientHeight;
            if (distanceToBottom < 50 && hasMoreRoles && !roleLoading && !isLoadingRef.current) {
                loadMoreRoles();
            }

        }
        modalBody.addEventListener('scroll', handleScroll);
        return () => modalBody.removeEventListener('scroll', handleScroll);
    }, [hasMoreRoles, roleLoading, isModalOpen, loadMoreRoles]);


    const handleRoleChange = (role: Role, checked: boolean, user_id: number) => {
        const data = {
            role_id: role.id,
            user_id: user_id,
        }

        if (role && checked) {
            dispatch(createUserRole(data)).unwrap()
                .then((response) => {
                    showSuccessToast('Assign role success');
                    setUserRoles((prev) => [
                        ...prev,
                        { id: response.data.id, user_id, role_id: role.id }
                    ])
                })
                .catch(() => {
                    showErrorToast('Assign role failed');
                })
        } else {
            const userRole = userRoles.find((ur) => 
                ur.user_id === user_id && ur.role_id === role.id
            )
            if (userRole) {
                dispatch(deleteUserRole(userRole.id))
                    .unwrap()
                    .then(() => {
                        showSuccessToast('Revoke permission success');
                        setUserRoles((prev) => prev.filter((rp) => rp.id !== userRole.id));
                    })
                    .catch((error) => {
                        showErrorToast('Revoke permission success');
                        console.error('deleteRolePermission failed:', error);
                    });
            } else{
                showErrorToast('Revoke permission success');
            }
        }

        dispatch(fetchUsers({page: 1, keyword: ''}));
    }

    const handleAssignRoles = () => {
        onClose();
    }
    return (
        <Modal
            title={`Assign role to: ${user?.name}`}
            open={isModalOpen}
            onOk={handleAssignRoles}
            onCancel={onClose}
            okText="Assign"
            cancelText="Cancel"
        >
            <div ref={modalBodyRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {roles.map((role) => (
                        <Checkbox
                            key={role.id}
                            checked={userRoles.some(
                                (ur) => ur.role_id === role.id && ur.user_id === user?.id
                            )}
                            onChange={(e) => {
                                if (user && user.id) {
                                    handleRoleChange(role, e.target.checked, user.id);
                                } else {
                                    console.error('User is undefined');
                                }
                            }}
                        >
                            {role.name}
                        </Checkbox>
                    ))}
                    {roleLoading && <div>Loading more roles</div>}
                    {roleError && <div>Error:</div>}
                    {!hasMoreRoles && <div>Total roles loaded: {roles.length} (No more to load)</div>}
                    <div ref={loadMoreRef} style={{ height: '20px', background: 'transparent' }} />
                </Space>
            </div>
        </Modal>
    )
}

export default AssignRole;