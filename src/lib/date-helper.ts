export const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (seconds < 60) {
        return `Just now`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    return createdDate.toLocaleDateString();
}

export const formatTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expiresDate = new Date(expiresAt);
    const seconds = Math.floor((expiresDate.getTime() - now.getTime()) / 1000);

    if (seconds <= 0) {
        return 'Expired';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m remaining`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h remaining`;
    }

    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
}