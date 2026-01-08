import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../shared';

interface AuthContextType {
    user: User | null;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // response is usually { message: "...", profile: { ...Account, teacherProfile: ... } }
                    const response: any = await authService.getMe();
                    
                    // Map backend "profile" structure to frontend "User" interface
                    if (response.profile) {
                        const p = response.profile;
                        // Determine name and specific ID based on role
                        let name = p.email; // fallback
                        let teacherId = undefined;
                        let learnerId = undefined;

                        if (p.role === 'TEACHER' && p.teacherProfile) {
                            name = p.teacherProfile.fullName;
                            teacherId = p.teacherProfile.idTEACHER;
                        } else if (p.role === 'LEARNER' && p.learnerProfile) {
                            name = p.learnerProfile.fullName;
                            learnerId = p.learnerProfile.idLEARNER;
                        } else if (p.role === 'ADMIN' && p.adminProfile) {
                             name = p.adminProfile.fullName;
                        }

                        setUser({
                            id: p.idACCOUNT,
                            email: p.email,
                            role: p.role,
                            name: name,
                            teacherId: teacherId,
                            learnerId: learnerId
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (data: { token: string; user: any }) => {
        localStorage.setItem('token', data.token);
        // Ensure the user object from login response matches User interface
        // With the backend update, data.user should now have teacherId
        setUser(data.user);
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};