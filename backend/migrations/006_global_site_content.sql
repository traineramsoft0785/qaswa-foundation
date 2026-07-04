-- Global site content: footer branding + contact info (shared by Footer and Contact page)
INSERT INTO site_content (page, section_key, data) VALUES
('global', 'footer_branding', '{"heading":"The Qaswa Foundation","tagline":"Education for All","description":"A charitable trust working to provide education, skills, and opportunities to underprivileged children.","logo_url":""}'),
('global', 'contact_info', '{"address":"Laxmipur, Raxaul, Bihar","email":"theqaswafoundation@gmail.com","phone":"+91 9470601414"}')
ON CONFLICT (page, section_key) DO NOTHING;
