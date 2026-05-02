/* Container Style */
.schema-faq.wp-block-yoast-faq-block {
    display: flex;
    flex-direction: column;
    max-width: 1200px; /* Adjust to your content width */
    margin: 24px auto;
}

/* Individual FAQ Item Style */
.schema-faq-section {
    background-color: transparent; /* Or your preferred background */
    border-radius: 22px;
    box-shadow: 12px 12px 50px rgba(0, 0, 0, 0.4);
    padding: 10px 20px;
    margin-bottom: 20px;
}

/* Question Header Style */
.schema-faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    padding: 10px 0;
}

/* Answer Content Style (Hidden by default) */
.schema-faq-answer {
    display: none; /* This is toggled by JavaScript */
    font-size: 18px;
    line-height: 1.6;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 15px;
    padding-top: 15px;
}

/* Ensure the + icon is visible on the right */
.schema-faq-question::after {
    content: "+";
    font-size: 24px;
}

/* Optional: Rotate icon when open */
.schema-faq-section.is-open .schema-faq-question::after {
    content: "−"; /* or rotate the + icon */
}
