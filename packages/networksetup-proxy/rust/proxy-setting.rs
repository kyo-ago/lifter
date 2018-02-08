use std::env;
use std::process::Command;

fn main() {
    use std::os::unix::process::CommandExt;
    let mut command = Command::new("/usr/sbin/networksetup");

    let mut args = env::args();
    args.next();

    let param = args.next().unwrap();

    match param.as_ref() {
        "-setwebproxy"
        | "-setsecurewebproxy"
        | "-setwebproxystate"
        | "-setsecurewebproxystate"
        | "-setproxybypassdomains"
        | "-setautoproxyurl"
        | "-setautoproxystate"
        => {
            command.arg(param);
            for arg in args {
                command.arg(arg);
            }
        },
        "-setwebproxy"
        | "-setsecurewebproxy"
        | "-setwebproxystate"
        | "-setsecurewebproxystate"
        | "-setproxybypassdomains"
        | "-setautoproxyurl"
        | "-setautoproxystate"
        => {
            let mut command = Command::new("/usr/sbin/networksetup");
            command.arg(param);
            for arg in args {
                command.arg(arg);
            }
        },
        _ => panic!("Unknown parameter: {}", param),
    };

    command.uid(0);
    let output = match command.output() {
        Ok(p) => p,
        Err(e) => panic!("Failed to execute: {}", e),
    };

    print!("{}", String::from_utf8_lossy(output.stdout.as_slice()));
}
