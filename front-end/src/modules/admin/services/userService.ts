import api from "../../../services/api"

interface User {
    id: number,
    name: string,
    email: string,
    passwork: string,
}

interface UserResponse {
    status: string,
    message: string,
    data: User[]
}

const userService = {
    
    // getUser: (): Promise<UserResponse> => {
    //     const response = api.get<UserResponse>('/users');
    //     return response.data;
    // },


}

export default userService;