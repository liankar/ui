export const ABOUT_DATA = [
    {
        name: 'version',
        value: 'v4.5.6'
    },
    {
        name: 'backend version',
        value: 'v1.2.3'
    },
    {
        category: 'collector',
        name: 'parser version',
        value: 'v8.8.8'
    },
];

const MD_CONTENT = `
You can easily navigate to certain time and watch cluster condition

![Kubevious Time Machine screen](https://github.com/kubevious/media/raw/master/screens/time-machine-1.png)

### Scheduled updates

| Product           | Dec   | Jan   | Feb   |
|-------------------|-------|-------|-------|
| Kubevious UI      | 4.5.7 | 4.5.8 | 4.5.9 |
| Kubevious backend |       | 1.2.4 |       |
| Collector         |       |       | 8.8.9 |

### Other improvements

- Added personal message notification to user
- Added notification snooze functionality
- Made improvements to the UI/UX
`

export const NEW_VERSION_AVAILABLE_DATA = {
    "kind": "new-version",
    "name": "Kubevious",
    "version": "1.6.1",
    "url": "https://github.com/kubevious/kubevious/releases/tag/v0.6",
    "changes": [
        "Rule editor. Define custom rules to continuously validate Kubernetes cluster and apps configurations.",
        "Marker editor. Associate custom markers to configurations using smart filters.",
        "Continuous diagram, properties alerts refresh upon changes.",
        "Frontend rewritten using React.",
        "Fixed issue related to preparing sql statements after connection restart. #12, #25",
        "Fixed issue related to DB initialization. #16",
        "Fixed issue with timeline contents getting disappeared after window reopen. #17",
        "Fixed UI crash on startup. kubevious/helm#7",
    ],
    "features": [
        "Rules editor",
        "Markers editor",
        "Diagram autorefresh"
    ],
    "content": MD_CONTENT
}

export const FEEDBACK_QUESTIONS = {
    "kind": "feedback-request",
    "id": "7654e321-e89b-12d3-a456-426614174000",
    "questions": [
        {
            "id": "recommend-to-a-friend",
            "kind": "rate",
            "text": "How likely would you recommend Kubevious to a friend?",
        },
        {
            "id": "ease-of-use",
            "kind": "rate",
            "text": "How do you like the easy of use?",
            "optional": true
        },
        {
            "id": "history-feature",
            "kind": "single-select",
            "text": "How useful was the TimeMachine capability?",
            "options": ["Yes", "Somehow", "No"],
            "optional": false
        },
        {
            "id": "new-functionality",
            "kind": "single-select",
            "text": "Is there some additional functionality you want to see in Kubevious?",
            "options": ["Yes", "No"],
            "optional": true
        },
        {
            "id": "cloud-environments",
            "kind": "multi-select",
            "text": "Which cloud environments do you use? Check all that apply.",
            "options": ["aws", "gcp", "azure", "on-prem"]
        },
        {
            "id": "other-products",
            "kind": "multi-select",
            "text": "What other tools do you use along with Kubevious? Check all that apply.",
            "options": ["kubectl", "Dashboard", "Lens", "Octant"],
            "optional": true
        },
        {
            "id": "best-capability",
            "kind": "input",
            "text": "What is the best capability of Kubevious that you liked more?"
        },
        {
            "id": "comments",
            "kind": "input",
            "text": "Comment your Kubevious experience",
            "optional": true
        },
    ]
}


export const MESSAGE_DATA = {
    "kind": "message",
    "id": "123456-e88e",
    "title": "Try out moving back in time with our Timeline function!",
    "content": MD_CONTENT
}
