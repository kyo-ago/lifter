use std::env;
use std::process::Command;

fn main() {
    use std::os::unix::process::CommandExt;
    let mut command = Command::new("/usr/sbin/networksetup");

    let mut args = env::args();
    args.next();

    let param = args.next().unwrap();

    match param.as_ref() {
        "-setwebproxystate"
        | "-setsecurewebproxystate"
        | "-setproxybypassdomains"
        | "-setautoproxystate"
        => {
            command.arg(param);
            for arg in args {
                command.arg(arg);
            }
        },
        "-setwebproxy"
        | "-setsecurewebproxy"
        => {
            command.arg(param);
            command.arg(args.next().unwrap()); // networkservice
            command.arg("localhost"); // domain
            command.arg(args.next().unwrap()); // port
            for arg in args {
                command.arg(arg);
            }
        },
        "-setautoproxyurl"
        => {
            command.arg(param);
            command.arg(args.next().unwrap());
            command.arg(format!("http://127.0.0.1:{}/proxy.pac", args.next().unwrap()));
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
