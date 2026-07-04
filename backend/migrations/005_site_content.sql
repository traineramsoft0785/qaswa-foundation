-- Site content table (admin-editable copy for public pages)
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR(50) NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (page, section_key)
);

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO site_content (page, section_key, data) VALUES
('home', 'hero', '{"heading":"The Qaswa Foundation","tagline":"التعليم للجميع (Education for All)","subtitle":"A charitable trust in Laxmipur, Raxaul working to provide education, skills, and opportunities to underprivileged children.","primary_button_label":"Donate Now","secondary_button_label":"Learn More"}'),
('home', 'who_we_are', '{"heading":"Who We Are","body":"We believe education is the most powerful tool to transform lives. Our mission is to bring equal opportunities to every child regardless of their background or circumstances."}'),
('about', 'intro', '{"body":"The Qaswa Foundation is a charitable trust based in Laxmipur, Raxaul, dedicated to transforming lives through education. We believe every child deserves access to quality education regardless of their socio-economic background."}'),
('about', 'mission', '{"heading":"Our Mission","body":"To provide free and accessible education, skills training, and scholarship opportunities to underprivileged children and youth in our community, empowering them to build a better future."}'),
('about', 'vision', '{"heading":"Our Vision","body":"A world where every child has the opportunity to learn, grow, and achieve their full potential — regardless of where they come from."}'),
('about', 'what_we_do', '{"heading":"What We Do","items":["Free coaching and tutoring for school students","Scholarship support for deserving students","Digital literacy and computer skills training","Career guidance and mentorship programs","Community awareness programs on education"]}')
ON CONFLICT (page, section_key) DO NOTHING;
