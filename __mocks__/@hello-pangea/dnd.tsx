import React from "react";

export const DragDropContext = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const Droppable = ({
  children,
}: {
  children: (provided: object, snapshot: object) => React.ReactNode;
}) =>
  children(
    { innerRef: () => {}, droppableProps: {}, placeholder: null },
    { isDraggingOver: false }
  ) as React.ReactElement;

export const Draggable = ({
  children,
}: {
  children: (provided: object, snapshot: object) => React.ReactNode;
}) =>
  children(
    { innerRef: () => {}, draggableProps: {}, dragHandleProps: {} },
    { isDragging: false }
  ) as React.ReactElement;
