use std::env;
use std::process::Command;

fn main() {
    use std::os::unix::process::CommandExt;
    let mut cmd = build_command();
    cmd.uid(0);
    let output = match cmd.output() {
        Ok(p) => p,
        Err(e) => panic!("Failed to execute: {}", e),
    };
    print!("{}", String::from_utf8_lossy(output.stdout.as_slice()));
}

fn build_command() -> Command {
    let mut command = Command::new("/usr/sbin/networksetup");
    let args: Vec<_> = env::args().collect();
    if args.len() > 1 {
        for arg in args.iter() {
            command.arg(arg[1]);
            print!("{}", arg[1]);
        }
    }
    command
}
