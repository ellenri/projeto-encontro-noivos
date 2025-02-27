-- Create engaged_couples table
CREATE TABLE IF NOT EXISTS engaged_couples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   couple_name TEXT NOT NULL,    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mentor_couples table
CREATE TABLE IF NOT EXISTS mentor_couples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_couples_name TEXT NOT NULL,    
    mentee_quantity INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mentorship_matches table
CREATE TABLE IF NOT EXISTS mentorship_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    engaged_couple_id UUID REFERENCES engaged_couples(id) ON DELETE CASCADE,
    mentor_couple_id UUID REFERENCES mentor_couples(id) ON DELETE CASCADE,
    match_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
