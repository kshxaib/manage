import { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useDeveloperStore } from '../../stores/useDeveloperStore';

import ProjectHeader from './project-overview/ProjectHeader';
import OverviewTab from './project-overview/OverviewTab';
import TeamTab from './project-overview/TeamTab';
import DocumentsTab from './project-overview/DocumentsTab';
import PaymentsTab from './project-overview/PaymentsTab';
import InfrastructureTab from './project-overview/InfrastructureTab';

const ProjectOverview = ({ projectId, projects, onBack }) => {
    const { user } = useAuthStore();
    const { developers } = useDeveloperStore();
    const {
        toggleProjectLock,
        addDeveloperToProject,
        removeDeveloperFromProject,
        addDocument,
        updateProjectInfo,
        updateInfrastructure,
        recordPayment,
        updateClosureNotes,
        isLoading
    } = useProjectStore();

    const [activeTab, setActiveTab] = useState('overview');

    const project = projects?.find(p => p._id === projectId);

    if (!project) return (
        <div className="flex flex-col items-center justify-center p-20 bg-bg-card border border-border rounded-xl">
            <h3 className="text-xl font-bold text-text-primary">Project Not Found</h3>
            <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg transition-all hover:bg-primary-hover shadow-lg shadow-primary/20 font-bold uppercase text-xs tracking-widest">Go Back</button>
        </div>
    );

    const isAdmin = user?.role === 'ADMIN';
    const isLocked = project?.isLocked;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'developers', label: 'Team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'documents', label: 'Docs', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-3M8 7H6' },
        ...(isAdmin ? [{ id: 'payments', label: 'Payments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }] : []),
        { id: 'infrastructure', label: 'Infras', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
            {/* Header Section */}
            <ProjectHeader
                project={project}
                isAdmin={isAdmin}
                isLocked={isLocked}
                isLoading={isLoading}
                onBack={onBack}
                toggleProjectLock={toggleProjectLock}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
            />

            {/* Content Area */}
            <div className="bg-bg-card border border-border rounded-xl shadow-sm min-h-[400px]">
                {activeTab === 'overview' && (
                    <OverviewTab
                        project={project}
                        isAdmin={isAdmin}
                        isLocked={isLocked}
                        updateProjectInfo={updateProjectInfo}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'developers' && (
                    <TeamTab
                        project={project}
                        developers={developers}
                        isAdmin={isAdmin}
                        isLocked={isLocked}
                        addDeveloperToProject={addDeveloperToProject}
                        removeDeveloperFromProject={removeDeveloperFromProject}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'documents' && (
                    <DocumentsTab
                        project={project}
                        isAdmin={isAdmin}
                        isLocked={isLocked}
                        addDocument={addDocument}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'payments' && (
                    <PaymentsTab
                        project={project}
                        isAdmin={isAdmin}
                        isLocked={isLocked}
                        recordPayment={recordPayment}
                        updateClosureNotes={updateClosureNotes}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'infrastructure' && (
                    <InfrastructureTab
                        project={project}
                        isAdmin={isAdmin}
                        isLocked={isLocked}
                        updateInfrastructure={updateInfrastructure}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectOverview;
