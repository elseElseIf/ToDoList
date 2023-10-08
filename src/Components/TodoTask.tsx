import React, { useState } from 'react';
import {Task} from "../Interfaces";
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

interface TodoTaskProps {
    task: Task;
    completeTask(taskNameToDelete: string): void;
    editTask(taskId: number, newTaskName: string, newDeadline: string): void;
}

const TodoTask: React.FC<TodoTaskProps> = ({ task, completeTask, editTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTaskName, setEditedTaskName] = useState(task.taskName);
    const [editedDeadline, setEditedDeadline] = useState(task.deadline);

    const handleEdit = () => {
        editTask(task.id, editedTaskName, editedDeadline);
        setIsEditing(false);
    };

    return (
        <div className="task" style={{ textDecoration: task.taskName ? 'none' : 'line-through' }}>
            <div className="task-text">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                    />
                ) : (
                    task.taskName
                )}
            </div>
            <div className="task-deadline">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedDeadline}
                        onChange={(e) => setEditedDeadline(e.target.value)}
                    />
                ) : (
                    task.deadline
                )}
            </div>
            <div className="btn-container">
                <Tooltip title="delete">
                    <Button className="btn-delete" type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => completeTask(task.taskName)}>
                    </Button>
                </Tooltip>
                <Button type="primary" onClick={isEditing ? handleEdit : () => setIsEditing(!isEditing)}> {isEditing ? 'Захаваць' : 'Рэдагаваць'}
                </Button>
            </div>

        </div>
    );
};
export default TodoTask