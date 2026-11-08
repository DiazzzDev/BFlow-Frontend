export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
    path?: string;
};

export interface ApiFieldError {
    field: string;
    code: string;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    code?: string;
    errors?: ApiFieldError[];
    timestamp?: string;
    path?: string;
}

export interface PaginatedListResponse<T> {
    success: boolean;
    message: string;
    data: {
        totalElements: number;
        totalPages: number;
        numberOfElements: number;
        pageable: {
            unpaged: boolean;
            pageNumber: number;
            paged: boolean;
            pageSize: number;
            offset: number;
            sort: {
                unsorted: boolean;
                sorted: boolean;
                empty: boolean;
            };
        };
        size: number;
        content: T[];
        number: number;
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    timestamp: string;
    path: string;
}
