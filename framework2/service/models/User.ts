export interface User {
    _id: string;
    createdAt: Date;
    services: {
        password: {
            bcrypt: string;
        };
        email: {
            verificationTokens: {
                token: string;
                address: string;
                when: Date;
            }[];
        };
        resume: {
            loginTokens: {
                when: Date;
                hashedToken: string;
            }[];
        };
    };
    username: string;
    emails: {
        address: string;
        verified: boolean;
    }[];
    profile: {
        boardView: string;
        templatesBoardId: string;
        cardTemplatesSwimlaneId: string;
        listTemplatesSwimlaneId: string;
        boardTemplatesSwimlaneId: string;
    };
    authenticationMethod: string;
    isAdmin: boolean;
}
