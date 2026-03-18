export function getClassroomTransitionTag(roomId: string, origin?: string) {
    const normalizedOrigin = (origin ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "_");
    return `classroom-card-${normalizedOrigin}-${roomId}`;
}
