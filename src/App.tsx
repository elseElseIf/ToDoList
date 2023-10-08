import React, {useState, ChangeEvent} from 'react';
import './App.css';
import {Task} from './Interfaces';
import TodoTask from "./Components/TodoTask";
import { LinkedinOutlined, GithubOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button, Tooltip, Layout, Space, Modal, Calendar, Col, Row, Select, theme } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import type { CalendarProps } from 'antd';

dayjs.extend(dayLocaleData);

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 100,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
    flex:30,
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
};

const footerStyle: React.CSSProperties = {
    height: 40,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
    flex:10,
};

const App: React.FC = () => {
    const currentDateElement = document.querySelector('.ant-picker-cell-selected');
    const currentDate = currentDateElement ? currentDateElement.getAttribute('title') : '';
    const [size, setSize] = useState<SizeType>('large');
    const [task, setTask] = useState<string>("");
    const [deadline, setDeadline] = useState<string>(() => currentDate || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedToday, setSelectedToday] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const { token } = theme.useToken();

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.name === "task") {
            setTask(event.target.value);
        } else {
            setDeadline(event.target.value);
        }
    };
    const addTask = (): void => {
        if (!task) {
            alert("Укажыце назву вашага задання, поле не павiнна быць пустым");
            return;
        }
        const todayElement = document.querySelector('.ant-picker-cell-today');
        const selectedData = document.querySelector('.ant-picker-cell-selected');
        const previousSelectedToday = document.querySelector('.ant-picker-cell-today.ant-picker-cell-selected');
        if (previousSelectedToday) {
            previousSelectedToday.classList.remove('ant-picker-cell-selected');
        }

        if (todayElement && !selectedData) {
            todayElement.classList.add('ant-picker-cell-selected');
            setSelectedToday(true);
        } else if (selectedData) {
            selectedData.classList.remove('ant-picker-cell-selected');
        }

        const selectedDate = selectedData ? selectedData.getAttribute('title') : '';
        const newTask: Task = { id: Date.now(), taskName: task, deadline: selectedDate || dayjs().format('YYYY-MM-DD') };
        setTaskList(prevTaskList => [...prevTaskList, newTask]);
        setTask("");
        setDeadline("");
        setSelectedToday(false);
    };
    const editTask = (taskId: number, newTaskName: string, newDeadline: string): void => {
        const updatedTaskList = taskList.map((task) =>
            task.id === taskId ? { ...task, taskName: newTaskName, deadline: newDeadline } : task
        );
        setTaskList(updatedTaskList);
    };
    const completeTask = (taskNameToDelete: string): void => {
        setTaskList(taskList.filter((task) => {
            return task.taskName !== taskNameToDelete;
        }))
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        const isTodaySelected = dayjs().isSame(value, 'day');
        setSelectedToday(isTodaySelected);
    };

    return (
        <Space direction="vertical" style={{width: '100%'}} size={[0, 48]}>
            <Layout>
                <Header style={headerStyle}>
                    <h1> TODO LIST</h1>
                    <div className="inputContainer">
                        <input type="text" placeholder="Ваша заданне" name="task" value={task} onChange={handleChange} className="task_input"
                               required/>
                        {/*<input type="text" placeholder="Deadline" name="deadline" value={deadline || dayjs().format('YYYY-MM-DD')}*/}
                        {/*       onChange={handleChange}/>*/}
                        <Button onClick={showModal} className="btn-openCalendar" type="primary" icon={<CalendarOutlined />} size={size} />
                        <Modal title="Выберыце дату выканання вашага задання" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div style={wrapperStyle}>
                                <Calendar
                                    fullscreen={false}
                                    headerRender={({ value, type, onChange, onTypeChange }) => {
                                        const start = 0;
                                        const end = 12;
                                        const monthOptions = [];

                                        let current = value.clone();
                                        const localeData = value.localeData();
                                        const months = [];
                                        for (let i = 0; i < 12; i++) {
                                            current = current.month(i);
                                            months.push(localeData.monthsShort(current));
                                        }

                                        for (let i = start; i < end; i++) {
                                            monthOptions.push(
                                                <Select.Option key={i} value={i} className="month-item">
                                                    {months[i]}
                                                </Select.Option>,
                                            );
                                        }

                                        const year = value.year();
                                        const month = value.month();
                                        const options = [];
                                        for (let i = year - 10; i < year + 10; i += 1) {
                                            options.push(
                                                <Select.Option key={i} value={i} className="year-item">
                                                    {i}
                                                </Select.Option>,
                                            );
                                        }
                                        return (
                                            <div style={{ padding: 8 }}>
                                                <Row gutter={8}>
                                                    <Col>
                                                        <Select
                                                            size="small"
                                                            className="my-year-select"
                                                            value={year}
                                                            onChange={(newYear) => {
                                                                const now = value.clone().year(newYear);
                                                                onChange(now);
                                                            }}
                                                        >
                                                            {options}
                                                        </Select>
                                                    </Col>
                                                    <Col>
                                                        <Select
                                                            size="small"
                                                            value={month}
                                                            onChange={(newMonth) => {
                                                                const now = value.clone().month(newMonth);
                                                                onChange(now);
                                                            }}
                                                        >
                                                            {monthOptions}
                                                        </Select>
                                                    </Col>
                                                </Row>
                                            </div>
                                        );
                                    }}
                                    onPanelChange={onPanelChange}
                                    className={selectedToday ? 'ant-picker-cell-selected' : ''}

                                />
                            </div>
                        </Modal>
                    </div>
                    <Button onClick={addTask} type="primary" size={size}> Стварыць задачу
                    </Button>
                </Header>
                <Content className="сontent" style={contentStyle}>
                    <div className="taskList">
                        {taskList.map((task: Task, key: number) => {
                            return (<TodoTask key={key} task={task} completeTask={completeTask} editTask={editTask}/>);
                        })}
                    </div>
                </Content>
                <Footer style={footerStyle}>
                    <a href="https://github.com/elseElseIf/ToDoList" target="_blank" rel="noopener noreferrer">
                        <Tooltip title="Github">
                            <Button type="primary" shape="circle" icon={<GithubOutlined />} />
                        </Tooltip>
                    </a>
                    <a href="https://by.linkedin.com/in/mikhail-pryka" target="_blank" rel="noopener noreferrer">
                        <Tooltip title="Linkedin">
                            <Button className="btn-linkedin" type="primary" shape="circle" icon={<LinkedinOutlined />} />
                        </Tooltip>
                    </a>
                </Footer>
            </Layout>
        </Space>
    );
};
export default App;
