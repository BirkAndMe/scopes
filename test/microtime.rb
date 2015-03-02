module Sass::Script::Functions
    def microtime()
        return Sass::Script::Number.new(Time.now.to_f * 1000)
    end
end
